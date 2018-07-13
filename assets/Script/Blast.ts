import ItemEnum from "./const/ItemEnum";
import ColliderEnum from "./const/ColliderEnum";

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

@ccclass
export default class Blast extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    cs : cc.PhysicsBoxCollider[] = [];

    

    start () {

        // this.scheduleOnce(()=>{
        //     this.node.destroy();
        // },0.58)

       
     this.cs  = this.getComponentsInChildren('cc.PhysicsBoxCollider');
        
        cc.log(this.cs);

        
        let v2 = this.cs[0].offset;
        cc.log('aabb->',this.cs[0].getAABB());
        let ab : cc.Rect = new cc.Rect(15.68,191.68,16.64,16.639999999999986);
        var colliderList = cc.director.getPhysicsManager().testAABB(ab);

        cc.log(colliderList);
    }

    // onAniEnd(){

        
    // }

    update (dt) {
        
       
    }
}
