class SceneRenderTileItem {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static tiles = {};

  static getOrders(tileItemData)
  {
    var order = ["front"];

    var hasBack = tileItemData.rotation.includes("BACK")
    var hasFlip = tileItemData.rotation.includes("FLIP")

    if(hasBack) { order.push("back") }

    if(hasFlip) {
      order.push("front_flipped")
      if(hasBack) { order.push("back_flipped") }
    }

    return order;
  }

  static createDebugSprite(x, y, w, h)
  {
    var background = new PIXI.Graphics();
    background.beginFill(0x0000FF);
    background.drawRect(0, 0, w, h);
    background.endFill();
    background.alpha = 0.2;
    background.position.set(x, y);
    Game.app.stage.addChild(background);
    return background;
  }

  static getFrameTiles(size)
  {
    var frameTiles = {
      tiles: [],
      extrem: []
    };

    for (var y = 0; y < size[1]; y++) {
      for (var x = 0; x < size[0]; x++) {
        var name = `${x}:${y}`

        if(x == size[0]-1 || y == size[1]-1) {
          if(!frameTiles.tiles[name]) {
            frameTiles.tiles[name] = [x, y];
          }
        }
      }
    }

    frameTiles.extrem = [`${size[0]-1}:0`, `0:${size[1]-1}`];

    return frameTiles
  }

  static setup()
  {
  }

  static renderTiles()
  {
    for (var tileItemId in Game.data.tileItems) {
      //if(tileItemId != 3) { continue }



      var tileItemData = Game.data.tileItems[tileItemId];
      var renderTile = this.tiles[tileItemId] = {};
      var baseTexture = Game.resources["tileitem:"+tileItemId].texture;

      renderTile.textures = [];
      renderTile.textures_index = {};

      var orders = this.getOrders(tileItemData);

      var eachFrameSize = {
        x: baseTexture.width / tileItemData.images,
        y: baseTexture.height / orders.length
      }

      //this.createDebugSprite(0, 0, eachFrameSize.x, eachFrameSize.y);

      var frameTiles = this.getFrameTiles(tileItemData.size);

      var gridInfo = TileMap.getGridInfo(tileItemData.size[0], tileItemData.size[1]);

      var offset = {
        x: eachFrameSize.x-gridInfo.rect.w,
        y: eachFrameSize.y-gridInfo.rect.h
      }

      console.log(offset)

      for (var o of orders) {
        var y = orders.indexOf(o)*eachFrameSize.y;

        for (var i = 0; i < tileItemData.images; i++) {
          var x = i*eachFrameSize.x;



          //--
          for (var frameTile_key in frameTiles.tiles) {
            var frameTile = frameTiles.tiles[frameTile_key];
            console.log(frameTile)

            var pos = TileMap.getTilePosition(frameTile[0], frameTile[1]);

            console.log(gridInfo.rect.x)

            var cutx = pos.x - (gridInfo.rect.x + TileMap.tileSize.width/2)
            var cuty = pos.y;
            var cutw = TileMap.tileSize.width;
            var cuth = TileMap.tileSize.height;

            cutx += offset.x/2;
            cuty += offset.y;

            var addy = -cuty;

            cuty += addy;
            cuth -= addy;

            //cuth = eachFrameSize.y - TileMap.tileSize.height;


            var name = `${o}_${i}_${frameTile_key}`;

            var t32Rect = new PIXI.Rectangle(x + cutx, y + cuty, cutw, cuth);
            var texture = new PIXI.Texture(baseTexture, t32Rect);

            var index = renderTile.textures.push(texture);

            renderTile.textures_index[name] = index-1;


          }
          //--


          //console.log(x, y)
        }
      }

      var part1 = { container: new PIXI.Container() }

      part1.container.x = TileMap.tiles["1:2"].container.x;
      part1.container.y = TileMap.tiles["1:2"].container.y;

      var sprite1 = new PIXI.AnimatedSprite([renderTile.textures[1], renderTile.textures[3]]);
      sprite1.pivot.set(sprite1.texture.width/2, sprite1.texture.height - TileMap.tileSize.height/2);
      sprite1.animationSpeed = 0.05;
      sprite1.gotoAndPlay(0);
      part1.container.addChild(sprite1);

      SceneGameObjects.addObject(part1);

      //-------

      var part2 = { container: new PIXI.Container() }

      part2.container.x = TileMap.tiles["1:1"].container.x;
      part2.container.y = TileMap.tiles["1:1"].container.y;

      var sprite2 = new PIXI.AnimatedSprite([renderTile.textures[0], renderTile.textures[2]]);
      sprite2.pivot.set(sprite2.texture.width/2, sprite2.texture.height - TileMap.tileSize.height/2);
      sprite2.animationSpeed = 0.05;
      sprite2.gotoAndPlay(0);
      part2.container.addChild(sprite2);

      SceneGameObjects.addObject(part2);


      //SceneGameRender.gameView.container.addChild(sprite1);
      //SceneGameRender.gameView.container.addChild(sprite2);

      //ObjectOrigin.show(sprite, `tileitem_${tileItemId}`);

      //console.log(renderTile)

      //this.createDebugSprite(0, 0, eachFrameSize.x, eachFrameSize.y);




    }

  }

  static tick(delta)
  {
  }

  static destroy()
  {
  }
}
