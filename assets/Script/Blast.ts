import ItemEnum from "./const/ItemEnum";
import ColliderEnum from "./const/ColliderEnum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Blast extends cc.Component {
        

    //碰撞矩形
    public upRect : cc.Rect;
    public downRect : cc.Rect;
    public rightRect : cc.Rect;
    public leftRect : cc.Rect;
    public centerRect : cc.Rect;


    ctx : cc.Graphics;

    onLoad () {
        this.ctx = cc.find("Graphics").getComponent(cc.Graphics);
    }
 

    start () {

        this.scheduleOnce(()=>{
            this.node.destroy();
        },0.58)

        // this._grahpicRect();
      
    }

    _grahpicRect(){
        //绘制矩形
       this.ctx.lineWidth = 2;

      
       this.ctx.strokeColor = cc.Color.RED;
       this.ctx.rect(this.downRect.x,this.downRect.y,this.downRect.width,this.downRect.height);
       this.ctx.stroke();


       this.ctx.strokeColor = cc.Color.GREEN;
       this.ctx.rect(this.centerRect.x,this.centerRect.y,this.centerRect.width,this.centerRect.height);
       this.ctx.stroke();

    this.ctx.strokeColor = cc.Color.GRAY;
    this.ctx.rect(this.rightRect.x,this.rightRect.y,this.rightRect.width,this.rightRect.height);
    this.ctx.stroke();

    this.ctx.strokeColor = cc.Color.BLUE;
    this.ctx.rect(this.leftRect.x,this.leftRect.y,this.leftRect.width,this.leftRect.height);
    this.ctx.stroke();

       this.ctx.strokeColor = cc.Color.YELLOW;
       this.ctx.rect(this.upRect.x,this.upRect.y,this.upRect.width,this.upRect.height);
       this.ctx.stroke();

    }



    _hitCollider(){
        let colliderList = [];

        if(this.upRect)
         colliderList = colliderList.concat(cc.director.getPhysicsManager().testAABB(this.upRect));

        if(this.downRect)
         colliderList = colliderList.concat(cc.director.getPhysicsManager().testAABB(this.downRect));

         if(this.leftRect)
         colliderList = colliderList.concat(cc.director.getPhysicsManager().testAABB(this.leftRect));

         if(this.rightRect)
         colliderList = colliderList.concat(cc.director.getPhysicsManager().testAABB(this.rightRect));

         if(this.centerRect){
            colliderList = colliderList.concat(cc.director.getPhysicsManager().testAABB(this.centerRect));

         }
         
        return colliderList;
    }


    update (dt) {
        
        
        let colliderList = this._hitCollider();
        if(colliderList.length > 0){
            cc.log(this.centerRect);
            cc.log('碰撞物体',colliderList);
            colliderList.forEach((c)=>{ this._handleConcactCollider(c)})
           
        }
       
    }

    _handleConcactCollider(collider){
        switch (collider['tag']){ 
                case ColliderEnum.Player :
                 cc.log("玩家死亡");
                 collider['node'].getComponent("Player").playerDead();
                 break;
            default:
                break;         
        }

    }
}
