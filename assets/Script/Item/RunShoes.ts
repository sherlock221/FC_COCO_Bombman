import Player from "../Player";
import AbsItem from "./AbsItem";


/**
 * 跑鞋
 * 增加玩家移动速度
 */
export default   class RunShoes extends AbsItem{

    private  _player : Player;

    //额外的移动速度30点
    private extraSpeed = 30;

    constructor(itemName : string, itemDesc : string, itemIcon : string,player : Player){
        super();
        this.itemName = itemName;
        this.itemDesc = itemDesc;
        this.itemIcon = itemIcon;
        this._player = player;       
    }

    public execute(): void {
        this._player.speed += this.extraSpeed;
    }

}