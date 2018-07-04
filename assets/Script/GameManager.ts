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
    
    
    debugDrawFlags : number;

    private static m_instance : GameManager;


    public static GetInstance():GameManager{
        return GameManager.m_instance;
    }

    onLoad(){
        GameManager.m_instance = this;         
    }

    onEnable() {
          //开启物理
          cc.director.getPhysicsManager().enabled = true;
          this.debugDrawFlags = cc.director.getPhysicsManager().debugDrawFlags;
          cc.director.getPhysicsManager().debugDrawFlags = 
              cc.PhysicsManager.DrawBits.e_jointBit |
              cc.PhysicsManager.DrawBits.e_shapeBit;
    }

    onDisable() {
        //关闭物理
        cc.director.getPhysicsManager().enabled = false;    
    }
    
    start () {
        //初始化地图         
        // this._initMap();            
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

    

    _initMap(){

        //向某一个方向移动的时候 会检测 当前位置+speed 是否会碰撞到墙壁
                
        let tileSize = this.WallLayer.getMapTileSize();
        let layerSize = this.WallLayer.getLayerSize();
        let tiles = this.WallLayer.getTiles();
    
        console.log("tileSize->",tileSize)
        console.log("layerSize->",layerSize)
        console.log("tiles->",tiles)
        
        console.log("瓦片坐标-->",this.getTileCoordFromPosition(cc.v2(8,0)));
        console.log("像素坐标-->",this.getPositionFromTileCoord(cc.v2(16,7)));

        // let v2 = this.WallLayer.getPositionAt(cc.v2(0,0));

        // console.log("局部坐标-->",this.node.convertToNodeSpaceAR(v2));

     

        // for (let i = 0; i < tiles.length; i++) {
            
        //    let ty = Math.floor(i / layerSize.width);
        //    let tx =  i % layerSize.width;
            
        //    //格子有内容
        //    if (tiles[i] !== 0) {         

        //     let pos = this.WallLayer.getPositionAt(cc.v2(tx,ty)); 

        //     pos.x = pos.x - 512/2 + 8;
        //     pos.y = pos.y - 240/2 + 8;

        //     let collider : cc.PhysicsBoxCollider = this.Collider.addComponent("cc.PhysicsBoxCollider");              
        //     collider.size = new cc.Size(tileSize.width,tileSize.height);
        //     collider.offset = new cc.Vec2(pos.x,pos.y);            
        //     collider.apply();
            
        //    }

        // }      
    }



    
}
