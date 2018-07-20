const {ccclass, property} = cc._decorator;

@ccclass
export default class Role extends cc.Component {

    // 0 正常  1 死亡
    state  : number = 0;    
    //移动速度
    speed : number = 0;
    //角色sprite对象
    spr : cc.Sprite;

    //角色方向
    dirX : number  = 0;
    dirY : number = 0;
    
    //当前hp
    hp :  number = 0;

    //动画组件
    ani : cc.Animation;
    //刚体组件
    rgb : cc.RigidBody;


    onLoad(){
        cc.log("parent load");
        this.ani = this.getComponent(cc.Animation);
        this.rgb = this.getComponent(cc.RigidBody);
        this.spr = this.getComponent(cc.Sprite);
    }

}