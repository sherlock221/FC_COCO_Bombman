import AbsItem from "./AbsItem";
import GameManager from "../GameManager";

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
export default class Item extends cc.Component {

    _spr : cc.Sprite;
    _item : AbsItem;

    onLoad () {
        this._spr = this.getComponent(cc.Sprite);
    }

    start () {

    }


     /**
     * 碰撞开始
     * @param other   产生碰撞的另一个碰撞组件
     * @param self    产生碰撞的自身的碰撞组件
     */
    onBeginContact (contact, selfCollider, otherCollider){ 
        //触发道具效果
        this._item.execute(); 
        this.node.destroy();
    }


    init(item : AbsItem){

       GameManager.GetInstance().loadAtlas("item")
        .then(res=>{
            let atlas = res as  cc.SpriteAtlas;
            this._spr.spriteFrame =  atlas.getSpriteFrame(item.itemIcon);
            this._item = item;      
        });  
    }

    // update (dt) {}
}
