class SceneTileMap {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static setup()
  {
    return
    
    var sizex = 2;
    var sizey = 3;

    var gridInfo = TileMap.getGridInfo(sizex, sizey);

    var background = new PIXI.Graphics();
    background.beginFill(0x0000FF);
    background.drawRect(gridInfo.rect.x, gridInfo.rect.y, gridInfo.rect.w, gridInfo.rect.h);
    background.endFill();
    background.alpha = 0.1;
    this.viewport.container.addChild(background);

    for (var y = 0; y < sizey; y++) {
      for (var x = 0; x < sizex; x++) {
        var pos = TileMap.getTilePosition(x, y);

        var tile = new PIXI.Sprite(Game.resources["tile"].texture);

        tile.anchor.set(0.5);
        tile.position.set(pos.x, pos.y);

        this.viewport.container.addChild(tile);
      }
    }


  }


  static tick(delta)
  {
  }

  static destroy()
  {
  }
}
