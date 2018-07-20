import UpgradeItem from "./UpgradeItem";
import Bomb from "../Bomb";
import Player from "../Player";
import GameManager from "../GameManager";

export default class BombRange extends UpgradeItem {

    private _player : Player;
    
    constructor(id :number ,itemName : string, itemDesc : string, itemIcon : string, itemLevel : number, itemMaxLevel : number, player : Player){
        super();
        this.id = id;
        this.itemName = itemName;
        this.itemDesc = itemDesc;
        this.itemIcon = itemIcon;
        this.itemLevel = itemLevel;
        this.itemMaxLevel = itemMaxLevel;
        this._player = player;
    }
      
    

    public execute(): void {
        this._player.bombLevel += this.itemLevel;     
        if(this._player.bombLevel > this.itemMaxLevel){
            this._player.bombLevel = this.itemMaxLevel;
        }

        GameManager.GetInstance().updateItemsUI(this);
    }


}