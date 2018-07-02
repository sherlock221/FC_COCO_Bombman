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
    


    onEnable() {
          //开启物理
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    }

    onDisable() {
        //关闭物理
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    }
    
    start () {
                    
        let tileSize = this.WallLayer.getMapTileSize();
        let layerSize = this.WallLayer.getLayerSize();
        let tiles = this.WallLayer.getTiles();
    

        console.log("tileSize->",tileSize)
        console.log("layerSize->",layerSize)
        console.log("tiles->",tiles)

        for (let i = 0; i < tiles.length; i++) {
            
           let ty = Math.floor(i / layerSize.width);
           let tx =  i % layerSize.width;

           if (tiles[i] !== 0) {
            //有图片
            let cnode = new cc.Node();
            cnode.name = this.WallLayer.getLayerName() + "(" + tx + "," + ty + ")";
            cc.log(cnode.name);
            cnode.anchorX = 0.5;
            cnode.anchorY = 0.5;

            let collider = cnode.addComponent(cc.BoxCollider);            
            collider.size = new cc.Size(tileSize.width, tileSize.height);
            collider.offset = new cc.Vec2( collider.size.width / 2, collider.size.height / 2);
            collider.enabled = true;
    
            cnode.width = tileSize.width;
            cnode.height = tileSize.height;
            
            let pos = this.WallLayer.getPositionAt(cc.v2(tx,ty));
            
            pos.x = pos.x - 512/2;
            pos.y = pos.y  -240/2;           
            cnode.setPosition(pos);
            this.Collider.addChild(cnode);          
           }

        }             

    }

    update(dt){

        
    }


    _getTilePos(posInPixel){
        var mapSize = this.Map.getMapSize();
        var tileSize = this.Map.getTileSize();

        // cc.log();
       
        // return cc.p(x, y);

        // var x = Math.floor(posInPixel.x / tileSize.width);
        // var y = Math.floor((mapSize.height - posInPixel.y) / tileSize.height);
     
        // return cc.p(x, y);
    }


    
}
