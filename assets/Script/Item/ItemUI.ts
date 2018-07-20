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
export default class ItemUI extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    _item : AbsItem;


    @property(cc.Sprite)
    icon : cc.Sprite;

    @property(cc.Label)
    label : cc.Label;


    onLoad () {}

    start () {

    }

    init(item : AbsItem){
        this._item = item;  
       this.updateItem(this._item);
    }

    updateItem(item : AbsItem){
       
          //加载图标
          GameManager.GetInstance().loadAtlas("item")
          .then(res=>{
              let atlas = res as  cc.SpriteAtlas;
              this.icon.spriteFrame =  atlas.getSpriteFrame(item.itemIcon);           
          });  

          //显示文字
          this.label.string = item.itemName; 

    }

   

    // update (dt) {}
}
