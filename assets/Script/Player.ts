import GameManager from "./GameManager";
import ColliderEnum from "./const/ColliderEnum";
import Item from "./Item/Item";
import Role from "./Role";
import Bomb from "./Bomb";
import AbsItem from "./Item/AbsItem";

const {ccclass, property} = cc._decorator;


@ccclass
export default class Player extends Role {
    
    //向右精灵动画 左方向直接反转
    @property([cc.SpriteFrame])
    WalkSprites : cc.SpriteFrame[] = [];
    
    //向上精灵动画
    @property([cc.SpriteFrame])
    UpWalkSprites : cc.SpriteFrame[] = [];

    //向下精灵动画
    @property([cc.SpriteFrame])
    DownWalkSprites : cc.SpriteFrame[] = [];
    
    //玩家持有道具列表
    items : AbsItem[] = [];

    //玩家放置炸弹集合
    private bombPosList = [];

    //炸弹等级
    bombLevel : number = 1;

    //炸弹携带数量
    bombCount : number = 5;
    
   /**
    * 构造函数
    */
   constructor() {
       super();
       //玩家移动速度
       this.speed = 60;
       //当前hp为1
       this.hp = 1;
   }


    onLoad () {
        super.onLoad();
        //方向按键监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.keyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.keyUp,this);
    
        //添加炸弹事件监听
        GameManager.GetInstance().EventBus.on("EventBombDestory",this._onEventBombDestory,this);
    }

    start () {
       
        //设置碰撞tag
        this.getComponent('cc.PhysicsCircleCollider').tag = ColliderEnum.Player;

    }

    onDestroy(){
        GameManager.GetInstance().EventBus.off("EventBombDestory",this._onEventBombDestory,this);
    }


   

    /**
     * 玩家死亡
     */
    playerDead(){
        //死亡标识
        this.state = 1;
        //播放动画
        this.ani.play("player_dead");
        //关闭物理
        this.rgb.active = false;
    
    }

    onAniDeadEnd(){
        this.node.destroy();
    }



    /**
     * 碰撞开始
     * @param other   产生碰撞的另一个碰撞组件
     * @param self    产生碰撞的自身的碰撞组件
     */
    onBeginContact (contact, selfCollider, otherCollider){
       console.log("发生碰撞..");       
       if(otherCollider['tag'] == ColliderEnum.Monster){
        cc.log("玩家死亡..");
            setTimeout(()=>{
                this.playerDead();
            },10);        
        }    
      this.node.color = cc.Color.RED;      
    }

    onEndContact(contact, selfCollider, otherCollider){
        this.node.color = cc.Color.WHITE;      
    }

    
   
    update (dt) {

     //左右方向   
     if(this.dirX){                              
        this._playFrame(this.spr,this.WalkSprites,"x");
        this.node.scaleX  = this.dirX;  
     } 
     else if(this.dirY){
        this._playFrame(this.spr,this.dirY == 1 ? this.UpWalkSprites :  this.DownWalkSprites,"y");
     }


       //移动控制
       let moveSpeed = cc.v2(this.dirX * this.speed,this.dirY * this.speed);
       this.rgb.linearVelocity = moveSpeed;       

    }


    /**
     * 切换帧动画
     * @param spr 
     * @param frames 
     * @param isHoz 
     */
    _playFrame(spr : cc.Sprite, frames : cc.SpriteFrame[], dirStr){
        let index =  Math.floor(Math.abs((dirStr == 'x' ? this.node.x * 0.1 : this.node.y * 0.1)  % frames.length ) );           
        spr.spriteFrame = frames[index];     
    }


    /**
     * 炸弹销毁回调
     * @param e 
     */
    _onEventBombDestory(e){
        console.log("炸弹已经销毁..",e);
        let pos = e.detail.pos;
        let bomb = this.bombPosList.filter((b)=> b.x == pos.x && b.y == pos.y)[0];
        this.bombPosList.splice(this.bombPosList.indexOf(bomb),1);
    }
    

    /**
     * 放置炸弹
     */
    _placeBomb(){
        cc.log("当前屏幕中炸弹数量",this.bombPosList.length);
        //获得炸弹放置位置
        let pos : cc.Vec2 = GameManager.GetInstance().getCurrentTiledPosition(this.node.position); 
        
        if(this.bombPosList.some((p)=> p.x == pos.x && p.y == pos.y)){
            cc.log("炸弹已经放置在此节点..");
            return;
        }

        //进行放置炸弹
        GameManager.GetInstance().loadPrefab("Bomb")
            .then(res=>{
                let bomb = res as cc.Node;
                bomb.getComponent(Bomb).init(this.bombLevel);
                //炸弹位置
                bomb.position = GameManager.GetInstance().getCurrentTiledPosition(this.node.position);        
                GameManager.GetInstance().Items.addChild(bomb);                 
                this.bombPosList.push(bomb.position);
            });
            

    }


    keyDown(event){

        if(this.state == 1) return;

        switch(event.keyCode){
            case cc.KEY.a:
            case cc.KEY.left:           
                this.dirX = -1;
                break;

            case cc.KEY.d:
            case cc.KEY.right:           
                this.dirX = 1;
                break;     
                
            case cc.KEY.w:
            case cc.KEY.up:           
                this.dirY = 1;
                break;
                case cc.KEY.s:
                case cc.KEY.down:           
                    this.dirY = -1;
                    break;
            case cc.KEY.j:
                this._placeBomb();
                break;        
            default:
                break;  

        }
    }

    keyUp(event){

        if(this.state == 1) return;

        switch(event.keyCode) {            
            case cc.KEY.a:
            case cc.KEY.d:        
            case cc.KEY.left:          
            case cc.KEY.right:            
                this.dirX = 0;       
                break;           
                case cc.KEY.w:
                case cc.KEY.s:        
                case cc.KEY.up:          
                case cc.KEY.down:            
                    this.dirY = 0;       
                    break;            
            default:
                break;             
        }   

    }
   
}
