import UpgradeItem from "./UpgradeItem";
import Bomb from "../Bomb";

export default class BombRange extends UpgradeItem {

    private _bombPrefab : cc.Prefab;
    
    constructor(id :number ,itemName : string, itemDesc : string, itemIcon : string, itemLevel : number, itemMaxLevel : number, bombPrefab : cc.Prefab){
        super();
        this.id = id;
        this.itemName = itemName;
        this.itemDesc = itemDesc;
        this.itemIcon = itemIcon;
        this.itemLevel = itemLevel;
        this.itemMaxLevel = itemMaxLevel;
        this._bombPrefab = bombPrefab;
    }
      
    public execute(): void {
        let bomb = this._bombPrefab.data.getComponent(Bomb);
        bomb.range += this.itemLevel;
    }



}