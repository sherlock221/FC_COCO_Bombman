const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraCtrl extends cc.Component {

    @property(cc.Node)
    Hero : cc.Node;

    camera : cc.Camera;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.camera = this.getComponent(cc.Camera);
    }
    start () {
       
    }
    onEnable () {
        cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);         
    }

    onDisable () {
        cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);
    }

    lateUpdate(dt){
       
        let targetPos = this.Hero.convertToWorldSpaceAR(cc.Vec2.ZERO);                       
        let pos = this.node.parent.convertToNodeSpaceAR(targetPos);  

        //摄像机边界范围判断
        if(pos.x <= 402 &&  pos.x >= 249){
             //只移动x轴心
            this.node.position = cc.p(pos.x,120);
        }
    }

    

  
}
