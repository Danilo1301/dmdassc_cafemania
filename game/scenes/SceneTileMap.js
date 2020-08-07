class SceneTileMap {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static setup()
  {

    for (var ix = -5; ix <= 5; ix++) {
      for (var iy = -5; iy <= 5; iy++) {
        var tile = new PIXI.Sprite.from("assets/images/tile.png");
        tile.x = this.viewport.width/2 + ix*158/2 + iy*158/2;
        tile.y = this.viewport.height/2 + iy*79/2 - ix*79/2;
        tile.anchor.set(0.5);
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
