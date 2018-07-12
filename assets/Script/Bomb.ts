import GameManager from "./GameManager";
import ColliderEnum from "./const/ColliderEnum";
import Blast from "./Blast";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Bomb extends cc.Component {


     //炸弹存在最大数量
     private _maxCount  : number;

     //炸弹爆炸范围
     private _range  : number = 5 ;
 
     public get maxCount(){ return this._maxCount;}
     public set maxCount(value){ this._maxCount = value;}
     public get range(){ return this._range;}
     public set range(value){ this._range = value;}
  
    //炸弹爆炸时间
    time : number  = 2;

    rgb : cc.RigidBody;
    circleCollider : cc.PhysicsCircleCollider;   
    prefabs : cc.Prefab [];

    //产生火焰的节点
    blastPosList  = [];
    

    

    onLoad () {
    
        this.rgb = this.getComponent(cc.RigidBody);
        this.circleCollider = this.getComponent('cc.PhysicsCircleCollider');
       
        //加载预制体
        GameManager.GetInstance().loadResArray(["Prefabs/blast_center","Prefabs/blast_head","Prefabs/blast_middle"])
            .then(res=>{
                this.prefabs = res as cc.Prefab[]; 
            });
    }

    start () {

        //启动倒计时
        this.scheduleOnce(()=>{
            this._bomb();
        },this.time);

        
    }

    
    _toggleSensor(sensor){
       
        this.scheduleOnce(()=>{
            this.circleCollider.sensor = sensor;       
            this.circleCollider.apply();
        },0.3)

    }
   
     onEndContact(contact, selfCollider, otherCollider){
         cc.log("离开炸弹碰撞前喵喵..",this.circleCollider.sensor);  
         if(this.circleCollider.sensor){
           this._toggleSensor(false);
         } 
               
     }


     /**
     * 炸弹爆炸
     */
    _bomb(){
        
        //火焰根节点
        let wrapNode = new cc.Node();
        //射线检测结果
        let emptyList = this._rayCastAround(this._range);
        //产生中心火焰
        this._createCenterBlast(wrapNode);
        //产生外层火焰
        emptyList.forEach((e)=>{
            this._createWrapBlast(wrapNode,e.dir,e.pos);           
        });
        //添加到场景中
        GameManager.GetInstance().Items.addChild(wrapNode);
        //发出销毁事件
        GameManager.GetInstance().EventBus.emit("EventBombDestory",{pos : this.node.position});
        this.node.destroy();
        
    }


    /**
     * 产生中心火焰
     */
    _createCenterBlast(wrapNode :cc.Node){

        //生成中心colider
        let centerCollider : cc.PhysicsBoxCollider = wrapNode.addComponent('cc.PhysicsBoxCollider');
        centerCollider.sensor = true;
        centerCollider.offset = this.node.position;
        centerCollider.size = cc.size(16,16);
        centerCollider['tag'] = ColliderEnum.Blast;
        wrapNode.setAnchorPoint(cc.p(0.5,0.5));
        let rigb : cc.RigidBody = wrapNode.getComponent(cc.RigidBody);
        rigb.type = cc.RigidBodyType.Static;
        rigb.enabledContactListener = false;
        rigb.fixedRotation = true;
        rigb.gravityScale = 0;

        //添加火焰脚本
        wrapNode.addComponent(Blast);

         //中心火焰
         let blastCenter = cc.instantiate(this.prefabs[0]);
         blastCenter.position = this.node.position;
         this.blastPosList.push(blastCenter);
        

    }

    /**
     * 产生外层火焰
     * @param wrapNode 
     * @param dir 
     * @param endPoint 
     */
    _createWrapBlast(wrapNode : cc.Node, dir : cc.Vec2, endPoint : cc.Vec2){

        let startPotin = this.node.position;       
        let rotation = 0;
         //数量
        let num = endPoint.sub(startPotin).mag() / 16;
        //生成colider
        let collider : cc.PhysicsBoxCollider = wrapNode.addComponent('cc.PhysicsBoxCollider');
        collider.sensor = true;
        collider['tag'] = ColliderEnum.Blast;
        
        cc.log('或——-',dir,endPoint,startPotin,endPoint.sub(startPotin).mag());

        collider.offset.x = endPoint.x;
        collider.offset.y = endPoint.y;

        collider.size.width  = 16;
        collider.size.height = 16;
      
        //方向
        if(dir.equals(cc.p(0,1))){
            rotation = 0;
            collider.size.height = 16 * num;
            collider.offset.y -= collider.size.height /2 - 8;
        }
        else if (dir.equals(cc.p(1,0))){
            rotation = 90; 
            collider.size.width = 16 * num;
            collider.offset.x -= collider.size.width /2 - 8;
           
        }
        else if (dir.equals(cc.p(0,-1))){
            rotation = 180;
            collider.size.height = 16 * num;
            collider.offset.y += collider.size.height /2 - 8;
           
        }
        else if (dir.equals(cc.p(-1,0))){
            rotation = 270;
            collider.size.width = 16 * num;
            collider.offset.x += collider.size.width /2 - 8;
        }

 
        for(let j=0;j<num; j++){       
            //外火焰 or 内火焰
            let node = cc.instantiate(this.prefabs[j == num -1 ? 1 : 2]);
            node.position = startPotin.add(dir.scale(cc.p(16,16).scale(cc.p(j+1,j+1))));
            node.rotation = rotation; 
            wrapNode.addChild(node); 
        }
    
      
    }

    


    /**
     * 4方向射线检测
     * 返回空节点 和 障碍物 集合
     * @param checkGird 检测格子数量
     */
    _rayCastAround(checkGird : number){

        let emptyList = [];
    
        //起点坐标
        let startPos : cc.Vec2 = this.node.parent.convertToWorldSpaceAR(this.node.position);
        //结束坐标
        let endPos : cc.Vec2;

        //检测顺序 上右下左
        let directions = [cc.p(0,1),cc.p(1,0),cc.p(0,-1),cc.p(-1,0)];
        
        for(let i = 0; i < directions.length;i++){ 
  
            endPos = startPos.add(directions[i].scale(cc.p(16 * checkGird,16 * checkGird)));
            //发射射线 
            let results : cc.PhysicsRayCastResult[] = cc.director.getPhysicsManager().rayCast(startPos,endPos,cc.RayCastType.All)
                        .filter((r)=>{
                            let tag = r.collider['tag'];
                            //过滤障碍
                            if(tag ==  ColliderEnum.Wall ||  tag == ColliderEnum.Steel){
                                return true;
                            }
                            return false;
                        })

            //障碍物进行排序处理
            results.sort((c1,c2)=>{
                let dis1 = c1.point.magSqr();
                let dis2 = c2.point.magSqr();
                
                if(i == 2 || i == 3){
                    dis1 = -dis1;
                    dis2 = -dis2;
                }

                if(dis1 > dis2) {
                    return 1;
                }
                else if(dis1 < dis2) {
                    return -1;
                }
                return 0;  
            });            
                    
            //障碍物
            if(results.length > 0){
                let collider = results[0].collider;
                //最近的一个collider的位置
                let pos = collider['tag'] == ColliderEnum.Steel ? collider['offset'] : collider['node'].position;
                //寻找空节点 碰到的collider前一个坐标
                let onePos = directions[i].scale(cc.p(16,16));
                let emptyEndPos :cc.Vec2 = pos.sub(onePos); 
                if(!emptyEndPos.equals(this.node.position)){
                    emptyList.push({dir: directions[i], pos : emptyEndPos});
                }

                //只处理最近一个障碍物
                this._handleConcactCollider(collider);
            }
            else{
                emptyList.push({dir: directions[i], pos : this.node.parent.convertToNodeSpaceAR(endPos)}); 
            }
          
        }
        
       return emptyList;
    } 

    
    _handleConcactCollider(collider){
        switch (collider['tag']){ 
            case  ColliderEnum.Wall:
                cc.log("炸到墙");
                collider['node'].getComponent("Wall").blastWall();
                break;
            default:
                break;         
        }

    }

    
    

    // update (dt) {}
}
