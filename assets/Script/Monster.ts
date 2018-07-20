import Role from "./Role";
import ColliderEnum from "./const/ColliderEnum";
import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Monster extends Role {

    //怪物类型
    type : number;

    //移动结束坐标
    endPos : cc.Vec2;

    //上右下左
    directions = [cc.p(0,1),cc.p(1,0),cc.p(0,-1),cc.p(-1,0)];

    onLoad () {
        super.onLoad();
        cc.log("child load..");
    }

    start () {

        //设置碰撞tag
        this.getComponent('cc.PhysicsCircleCollider').tag = ColliderEnum.Monster;
    
        this.schedule(this._move,16/this.speed)
        
    }

    onDestroy(){
        this.unschedule( this._move);
    }
    
   
     

     _rayCastAround(checkGird : number){

        let emptyList = [];
    
        //起点坐标
        let startPos : cc.Vec2 = this.node.parent.convertToWorldSpaceAR(this.node.position);
        //结束坐标
        let endPos : cc.Vec2;


        for(let i = 0; i < this.directions.length;i++){ 
            endPos = startPos.add(this.directions[i].scale(cc.p(16 * checkGird,16 * checkGird)));
            //发射射线 
            let results : cc.PhysicsRayCastResult[] = cc.director.getPhysicsManager().rayCast(startPos,endPos,cc.RayCastType.Any);
            //过滤障碍
            results = results.filter((r,index)=>{
                let tag = r.collider['tag'];      
                if(tag ==  ColliderEnum.Wall ||  tag == ColliderEnum.Steel || tag == ColliderEnum.Monster){
                    return true;
                }
                return false;
            })

            if(results.length <=0){
                emptyList.push({dir: i, pos : this.node.parent.convertToNodeSpaceAR(endPos)});  
            }
    
        }
        
       return emptyList;
    } 
     
     _move(){     
        
        if(this.state == 1){ return;}

        let emptyList = this._rayCastAround(1);
      
        if(emptyList.length > 0){
            //方向判断
            let index = Math.floor(cc.random0To1() * emptyList.length);
            let empty = emptyList[index];
    

            switch (empty.dir){
                case 1 :
                    this.ani.play("lower_monster_01_right");   
                    break;           
                case 3 :
                    this.ani.play("lower_monster_01_left");                    
                break;                    
            }

            this.node.runAction(cc.moveTo(16/this.speed,empty.pos));

        }

                


      
        
     }

    
    init(speed,hp,type){
        this.speed = speed;
        this.hp = hp;
        this.type = type;
    }

    update (dt) {
        
         //移动控制
        let moveSpeed = cc.v2(this.dirX * this.speed,this.dirY * this.speed);
        this.rgb.linearVelocity = moveSpeed;
        
        

    }

    /**
     * 死亡
     */
    monsterDead(){
        //死亡标识
        this.state = 1;
       
        //播放动画
        this.ani.play("monster_dead");
        //关闭物理
        this.rgb.active = false; 
        
    
    }

    onAniDeadEnd(){
        this.node.destroy();
    }
}
