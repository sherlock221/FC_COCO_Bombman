import AbsItem from "./AbsItem";
export default abstract class UpgradeItem extends AbsItem {

     private _itemLevel : number;
     private _itemMaxLevel : number;

     public get itemLevel(){ return this._itemLevel;}
     public set itemLevel(value){ this._itemLevel = value;}

     public get itemMaxLevel(){ return this._itemMaxLevel;}
     public set itemMaxLevel(value){ this._itemMaxLevel = value;}
    
    
    
}
