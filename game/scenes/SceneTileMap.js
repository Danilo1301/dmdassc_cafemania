class SceneTileMap {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static tiles = [];

  static setup()
  {
    var size = 6;

    for (var ix = -size; ix <= size; ix++) {
      for (var iy = -size; iy <= size; iy++) {
        var tile = new PIXI.Sprite.from("assets/images/tile.png");
        tile.x = this.viewport.width/2 + ix*158/2 + iy*158/2;
        tile.y = this.viewport.height/2 + iy*79/2 - ix*79/2;
        tile.anchor.set(0.5);
        this.viewport.container.addChild(tile);

        this.tiles.push(tile);
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
