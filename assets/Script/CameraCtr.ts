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
        //只移动x轴心
        let pos = this.node.parent.convertToNodeSpaceAR(targetPos);
        

        if(pos.x <= 402 &&  pos.x >= 249){
            this.node.position = cc.p(pos.x,120);
             cc.log('px->',pos);
        }

        
        // let ratio = targetPos.y / cc.winSize.height;
        // this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5;
    }

    

  
}
