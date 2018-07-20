import ColliderEnum from "./const/ColliderEnum";
import Item from "./Item/Item";
import RunShoes from "./Item/RunShoes";
import Player from "./Player";
import ItemEnum from "./const/ItemEnum";
import BombRange from "./Item/BombRange";
import Monster from "./Monster";
import ObjectOrderEnum from "./const/ObjectOrder";
import AbsItem from "./Item/AbsItem";
import ItemUI from "./Item/ItemUI";

const {ccclass, property} = cc._decorator;



@ccclass
export default class GameManager extends cc.Component {

    
 
    @property(cc.TiledMap)
    Map : cc.TiledMap;

    @property(cc.TiledLayer)
    BgLayer : cc.TiledLayer;

    @property(cc.TiledLayer)
    WallLayer : cc.TiledLayer;

    @property(cc.Node)
    Collider : cc.Node;

    @property(cc.Node)
    Items : cc.Node;

    @property(cc.Prefab)
    WallPrefab : cc.Prefab;

    @property(cc.Prefab)
    BombPrefab : cc.Prefab;

    
    @property(cc.Prefab)
    ItemPrefab : cc.Prefab;

    //空格子
    emptyTiles : cc.Vec2[] = [];
    
    //墙格子
    wallTiles : cc.Vec2[] = [];
    
    //全部道具
    uiItems : AbsItem[];

    //调试模式    
    debugDrawFlags : number;
    
    //全局事件总栈
    EventBus : cc.EventTarget;

    @property(cc.Prefab)
    ItemUIPrefab : cc.Prefab;

    //玩家
    _player : Player;

    private static m_instance : GameManager;

    public static GetInstance():GameManager{
        return GameManager.m_instance;
    }

    onLoad(){
        GameManager.m_instance = this;       
        this.EventBus = new cc.EventTarget();  
        
        this._player = cc.find("Game/Player").getComponent(Player);
        
    }

    onEnable() {
          //开启物理
          cc.director.getPhysicsManager().enabled = true;
          this.debugDrawFlags = cc.director.getPhysicsManager().debugDrawFlags;
        //   cc.director.getPhysicsManager().debugDrawFlags = 
        //       cc.PhysicsManager.DrawBits.e_jointBit |
        //       cc.PhysicsManager.DrawBits.e_shapeBit;
    }

    onDisable() {
        //关闭物理
        cc.director.getPhysicsManager().enabled = false;    
    }
    
    start () {
        //初始化地图         
        this._initMap();  
        //加载关卡
        this.loadLevel(1);   
    }


    update(dt){

       
        
    }

     /**
     * 像素坐标转换为瓦片坐标
     * @param pos 
     */
    getTileCoordFromPosition(pos : cc.Vec2){
        pos = this.node.convertToWorldSpaceAR(pos);
        let x =  Math.floor(pos.x  / this.Map.getTileSize().width);
        let y =  Math.floor((this.Map.getMapSize().height * this.Map.getTileSize().height - pos.y )	/ this.Map.getTileSize().height) ;		         
	    return cc.v2(x,y);
    }

    /**
     * 瓦片坐标转像素坐标
     * @param tileCoord 
     */
    getPositionFromTileCoord(tileCoord : cc.Vec2){
        let v2 =  this.node.convertToNodeSpaceAR(this.WallLayer.getPositionAt(tileCoord));
        v2.x =v2.x + this.Map.getTileSize().width /2;
        v2.y =v2.y + this.Map.getTileSize().height /2;
        return v2;
    }

 
    /**
     * 获得当前物体所在的 瓦片地图的像素坐标
     * @param pos 
     */
    getCurrentTiledPosition(pos :cc.Vec2){
        return this.getPositionFromTileCoord(this.getTileCoordFromPosition(pos));
    }



    getTilePropertiesByPosition(pos : cc.Vec2){
        //获得瓦片坐标         
        let tilePos = this.getTileCoordFromPosition(pos);
        //获得瓦片GID
        let tileGID =  this.WallLayer.getTileGIDAt(tilePos);
        if(tileGID > 0){
            let properties = GameManager.GetInstance().Map.getPropertiesForGID(tileGID);
            return {
                gid : tileGID,
                properties : properties
            }            
        }
        return null;
    }



    
    /**
     * 动态加载预制体
     * @param prefabName 
     */
    loadPrefab(prefabName : string){
        return new Promise((res,rej)=>{
            cc.loader.loadRes("Prefabs/"+prefabName,function(err,prefab){
                if(err) 
                    rej(err);
                else
                    res(cc.instantiate(prefab));
            });

        });
    }

    loadData(dataName : string){
        return new Promise((res,rej)=>{
            cc.loader.loadRes("Data/"+dataName,function(err,data){
                if(err) 
                    rej(err);
                else
                    res(cc.instantiate(data));
            });

        });
    }


    loadAtlas(atlaName : string){
        return new Promise((res,rej)=>{
            cc.loader.loadRes("Imgs/"+atlaName,cc.SpriteAtlas,function(err,atlas){
                if(err) 
                    rej(err);
                else
                    res(atlas);
            });

        });
    }
    
    loadResArray(urls  : string[]){
        return new Promise((res,rej)=>{
            cc.loader.loadResArray(urls,function(err,assets){
                if(err) 
                    rej(err);
                else{
                    res(assets);
                }
                    
            });

        });
    }

    

    _initMap(){

        //向某一个方向移动的时候 会检测 当前位置+speed 是否会碰撞到墙壁
                
        let tileSize = this.WallLayer.getMapTileSize();
        let layerSize = this.WallLayer.getLayerSize();
        let tiles = this.WallLayer.getTiles();
    
        console.log("tileSize->",tileSize)
        console.log("layerSize->",layerSize)
        console.log("tiles->",tiles)
        
        // console.log("瓦片坐标-->",this.getTileCoordFromPosition(cc.v2(8,0)));
        // console.log("像素坐标-->",this.getPositionFromTileCoord(cc.v2(16,7)));
        
     
        for (let i = 0; i < tiles.length; i++) {            
           let ty = Math.floor(i / layerSize.width);
           let tx =  i % layerSize.width;
           //格子有内容
           if (tiles[i] !== 0) {         
            let pos = this.WallLayer.getPositionAt(cc.v2(tx,ty)); 
            pos.x = pos.x - this.Map.node.getContentSize().width/2 + tileSize.width /2 ;
            pos.y = pos.y - this.Map.node.getContentSize().height/2 + tileSize.height /2;
            let collider : cc.PhysicsBoxCollider = this.Collider.addComponent("cc.PhysicsBoxCollider");              
            collider.size = new cc.Size(tileSize.width,tileSize.height);
            collider.offset = new cc.Vec2(pos.x,pos.y);  
            collider['tag'] = ColliderEnum.Steel;         
            collider.apply();            
           }
           else{               
                //空格子                                    
                this.emptyTiles.push(cc.v2(tx,ty));                     
           }    
        }
                           
    }

    /**
     * 创造可破坏的墙
     */
    _createWall(randomNum : number){
        
        //随机墙壁
        this.wallTiles = this._randomWall(randomNum);   

        //添加物理
        this.wallTiles.forEach(tilePos=>{                
            let node = cc.instantiate(this.WallPrefab);
            node.getComponent('cc.PhysicsBoxCollider').tag = ColliderEnum.Wall;
            let pos = this.getPositionFromTileCoord(tilePos);
            node.position = pos;
            node.setLocalZOrder(ObjectOrderEnum.Wall);
            this.Items.addChild(node);
            
        });    

        
        
    }

    /**
     *  创建怪物
     * @param monsters 
     */
    _createMonster(monsters){
        monsters.forEach(m => {
            let tiles = this._randomWall(m.count);
            tiles.forEach(pos => {
                this.loadPrefab("Monster")
                .then(res=>{
                    let node = res as cc.Node;                    
                    let monster = node.getComponent(Monster);
                    node.position = this.getPositionFromTileCoord(pos);;
                    monster.init(m['speed'],m['hp'],m['type']);
                    node.setLocalZOrder(ObjectOrderEnum.Monster);
                    this.Items.addChild(node);
                });
            });           
        });       
    }

    /**
     * 生成道具
     * @param items 
     */
    _createItems(items){
        let wallList = [];
        items.forEach(i => {
            let  wall;           
            while(!wall){
                let index = Math.floor(cc.random0To1() * (this.wallTiles.length - 1));
                wall = this.wallTiles[index];
                if(wallList.indexOf(wall) == -1){
                    wallList.push({tile : wall, item : i });
                }
                else{
                    wall = null;
                }
            }
        });

        wallList.forEach((w)=>{

        this.loadPrefab("Item")
            .then(res=>{
                let node = res as cc.Node;                    
                let item = node.getComponent(Item)
                let obj;
                switch(w.item){
                    case ItemEnum.RunShoes:
                    obj = new RunShoes(1,"跑鞋","增加30点移动速度","item_03",this._player)
                    break;
                    case ItemEnum.BombRange:
                    obj = new BombRange(2,"爆炸范围","增加1格爆炸范围","item_01",1,5,this._player);
                    break;
                    case ItemEnum.BombCount:
                    // obj = new RunShoes("炸弹数量","增加一个炸弹数量","item_04",this._player)
                    break;            
                }

                item.init(obj);
                node.setLocalZOrder(ObjectOrderEnum.Item);
                node.position = this.getPositionFromTileCoord(w.tile);               
                this.Items.addChild(node);
            });

        });
        
        
        
        
    }

    _randomWall(num : Number){   
        let tiles : cc.Vec2[] = [];   
        for(let i =0; i < num; i++){
            let index = Math.floor(cc.random0To1() * (this.emptyTiles.length - 1));
            let pos : cc.Vec2 = this.emptyTiles[index];   
            if(tiles.indexOf(pos) == -1){
               tiles.push(pos);
            this.emptyTiles.splice(index,1);
            }
        }
        return tiles
    }

    /**
     * 清空数据
     */
    _clearData(){            
        this.Items.removeAllChildren();
        cc.find("Game/Player").setPosition(-226,96);
    }

    /**
     * 切换关卡
     */
    loadLevel(level : number){
        let levelName = "level-" + level;
        //清空当前关卡数据
        this._clearData();
        //加载关卡数据
        this.loadData(levelName)
            .then(data=>{
                cc.log("关卡数据",data);
                //初始化墙
                this._createWall(data['walls']);           
               //初始化道具
               this._createItems(data['items']);
               //初始化怪物
               this._createMonster(data['monsters']);
               //初始化门                
               //人物回到起始位置               
            });

        //跑鞋
        // let node = cc.instantiate(this.ItemPrefab);
        // node.getComponent(Item).init(new RunShoes(1,"跑鞋","增加30点移动速度","item_03",this._player));
        // node.position = cc.p(-224,64);
        // this.Items.addChild(node);

        //爆炸范围
        // let node = cc.instantiate(this.ItemPrefab);
        // node.getComponent(Item).init(new BombRange(2,"爆炸范围增加","增加1格爆炸范围","item_01",1,5,this.BombPrefab));
        // node.position = cc.p(-224,64);
        // this.Items.addChild(node);
        
        
        // this.allItems[ItemEnum.RunShoes] =  new RunShoes(this._player);
        // //爆炸范围
        // this.allItems[ItemEnum.BombRange] = new BombRange(this.BombPrefab);
        
        
        
    }

    updateItemsUI(item : AbsItem){   

        let listRoot =  cc.find("Canvas/Ver/SkillList");
    
        switch(item.id){
            case ItemEnum.BombRange:
            let res = listRoot.getChildByName("item_"+item.id);
            item.itemName = "范围lv"+(this._player.bombLevel -1);
            if(!res){  
                addItem(this.ItemUIPrefab);       
            }
            else{
                let node = listRoot.getChildByName("item_"+item.id);
                node.getComponent(ItemUI).updateItem(item);                  
            }            
            break;
            default:
                addItem(this.ItemUIPrefab);
                break;
        }

        function  addItem(ItemUIPrefab){
            let node = cc.instantiate(ItemUIPrefab); 
            node.name = "item_"+item.id;
            node.getComponent(ItemUI).init(item);  
            listRoot.addChild(node);          
        }
            
    }




    
}
