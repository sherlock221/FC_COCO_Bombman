// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

//https://blog.csdn.net/potato47/article/details/54958538

@ccclass
export default class Player extends cc.Component {

    
    dirX : number  = 0;
    dirY : number = 0;
    hSpeed : number = 60;

    isCollider : boolean = false;

    //x轴是否碰撞，0：没有碰撞，-1：左方有碰撞，1：右方有碰撞
    collisionX = 0;
    collisionY = 0;

    //同时碰撞物体的个数
    touchingNumber  = 0;

    onLoad () {
        
        //事件监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.keyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.keyUp,this);
         
    }

    start () {
        
    }


    /**
     * 碰撞检测
     * @param other   产生碰撞的另一个碰撞组件
     * @param self    产生碰撞的自身的碰撞组件
     */
    onCollisionEnter (other, self){
       console.log("发生碰撞.."); 
      //核心原理 : 如果发生了不可移动的碰撞（障碍物），就退回到“上一次位置”
      
      //当前另一个碰撞组件的 aabb碰撞框
      let otherAabb = other.world.aabb;
      //上一次计算的碰撞组件的 aabb 碰撞框
      let otherPreAabb = other.world.preAabb.clone();

      //当前自身碰撞组件的 aabb碰撞框
      let selfAabb = self.world.aabb;
      //上一次计算的碰撞组件的 aabb 碰撞框
      let selfPreAabb = self.world.preAabb.clone();

      selfPreAabb.x = selfAabb.x;
      otherPreAabb.x = otherAabb.x;
        

      this.node.color = cc.Color.RED;
      this.touchingNumber++;
      
    
      if(cc.Intersection.rectRect(selfPreAabb,otherPreAabb)){        
            if (selfPreAabb.xMax > otherPreAabb.xMax) {
                this.node.x = otherPreAabb.xMax - this.node.parent.x;  
                this.collisionX = -1;     
            }
            
            else if (selfPreAabb.xMin < otherPreAabb.xMin) {
                this.node.x = otherPreAabb.xMin - selfPreAabb.width - this.node.parent.x;        
                this.collisionX = 1;            
            }    

            this.dirX = 0;
            other.touchingX = true;
            return;                                  
      }


      selfPreAabb.y = selfAabb.y;
      otherPreAabb.y = otherAabb.y;


      if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
        if ((selfPreAabb.yMax > otherPreAabb.yMax)) {
            this.node.y = otherPreAabb.yMax - this.node.parent.y;
    
            this.collisionY = -1;
        }
        else if ((selfPreAabb.yMin < otherPreAabb.yMin)) {
            this.node.y = otherPreAabb.yMin - selfPreAabb.height - this.node.parent.y;
            this.collisionY = 1;
        }
        
        this.dirY  = 0;    
        other.touchingY = true;           
    }    

      
     
    }

    onCollisionExit(other){
        this.touchingNumber--;
        if (this.touchingNumber === 0) {
            this.node.color = cc.Color.WHITE;
        }

        if (other.touchingX) {
            this.collisionX = 0;
            other.touchingX = false;
        }
        else if (other.touchingY) {
            other.touchingY = false;
            this.collisionY = 0;           
        }

    }
   
    

    update (dt) {

        let speed  = this.hSpeed;

        if(this.dirX != 0  && this.dirX != this.collisionX){
         this.node.x +=  this.dirX * speed * dt;
        }  

        if(this.dirY !=0 && this.dirY != this.collisionY){
            this.node.y +=  this.dirY * speed * dt;
        }   
    
    
    }

    keyDown(event){

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
            default:
                break;  

        }
    }

    keyUp(event){
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
