import ColliderEnum from "./const/ColliderEnum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Door extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        
    }

     /**
     * 碰撞开始
     * @param other   产生碰撞的另一个碰撞组件
     * @param self    产生碰撞的自身的碰撞组件
     */
    onBeginContact (contact, selfCollider, otherCollider){
        console.log("发生碰撞..");       
        if(otherCollider['tag'] == ColliderEnum.Player){
             alert("胜利!");
         }    
     
     }
 

    start () {

    }

    // update (dt) {}
}
