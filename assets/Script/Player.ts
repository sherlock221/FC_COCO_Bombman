import GameManager from "./GameManager";

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


    body : cc.RigidBody;

    end : boolean = false

    onLoad () {
        
        //事件监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.keyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.keyUp,this);
        
        this.body = this.getComponent(cc.RigidBody);
    }

    start () {
        
    }



    /**
     * 碰撞开始
     * @param other   产生碰撞的另一个碰撞组件
     * @param self    产生碰撞的自身的碰撞组件
     */
    onBeginContact (contact, selfCollider, otherCollider){
       console.log("发生碰撞..");    
      this.node.color = cc.Color.RED;      
    }

    onEndContact(contact, selfCollider, otherCollider){
        this.node.color = cc.Color.WHITE;      
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
   
    //检测移动move
    

    update (dt) {

        // let distanceX  = 0;
        // let distanceY = 0;
        // let nextTile = null;
        // if(this.dirX){
        //     distanceX = this.dirX * this.hSpeed * dt;                       
        // }  

        // if(this.dirY){
        //     distanceY = this.dirY * this.hSpeed * dt;                       
        // }  

        // if(this.dirX || this.dirY){
        //     //获得瓦片坐标         
        //   nextTile = GameManager.GetInstance().getTilePropertiesByPosition(cc.v2(this.node.x + distanceX,this.node.y + distanceY));      
    
        // }
                           
        // if(!nextTile){            
        //     this.node.x += distanceX;
        //     this.node.y += distanceY
        // }

     
        
       let cb = cc.v2(this.dirX * this.hSpeed,this.dirY * this.hSpeed);
       this.body.linearVelocity = cb;

      


      
        
 
    
                     
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
