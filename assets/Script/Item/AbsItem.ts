
export default abstract class AbsItem extends cc.Component {


    private _id : number;


    private _itemName: string;
    private _itemDesc: string;
    private _itemIcon: string;


    public get id(){ return this._id;}
    public set id(value){ this._id = value;}

    public get itemName(){ return this._itemName;}
    public set itemName(value){ this._itemName = value;}


    public get itemIcon(){ return this._itemIcon;}
    public set itemIcon(value){ this._itemIcon = value;}

    public get itemDesc(){ return this._itemDesc;}
    public set itemDesc(value){ this._itemDesc = value;}



    /**
     * 道具触发
     */
    public abstract  execute() : void;

}
