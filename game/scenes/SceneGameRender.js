class SceneGameRender {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static setup()
  {
    this.viewport.align = ALIGN.CENTER;

    this.background = PIXI.Sprite.from('assets/images/background1.png');
    this.viewport.container.addChild(this.background);

    this.gameView = this.viewport.createParentViewport(1024, 768);
    this.gameView.keepAspect = true;
    this.gameView.align = ALIGN.CENTER;

    Scenes.loadScene(SceneHud);

    Scenes.loadScene(SceneRenderPlayer);
    Scenes.loadScene(SceneRenderTileItem);
    Scenes.loadScene(SceneTileMap, this.gameView);
    Scenes.loadScene(SceneGameObjects, this.gameView);


    SceneTileMap.viewport.align = ALIGN.CENTER;
    SceneGameObjects.viewport.align = ALIGN.CENTER;

    SceneRenderTileItem.renderTiles();


    this.setupMouseInteractions();

    GameLogic.createNewGame();
    GameLogic.setupGame();

    TileMap.calculateNeighbours()

    SceneGameObjects.createPlayers();
  }

  static setupMouseInteractions()
  {
    this.viewport.container.interactive = true;
    this.viewport.container.on("mousemove", function(event) {
      var pos = (event.data.getLocalPosition(Game.app.stage));
      ////------------------------------------------
    })

    var moving = false;
    var startpos;
    var startpos_mouse;

    Game.app.stage.interactive = true;
    Game.app.stage.on("mousedown", function(event) {
      moving = true;
      startpos = {x: SceneGameRender.gameView.container.pivot.x, y: SceneGameRender.gameView.container.pivot.y};
      startpos_mouse = event.data.getLocalPosition(Game.app.stage);
    })

    Game.app.stage.on("mouseup", function(event) { moving = false; })

    Game.app.stage.on("mousemove", function(event) {
      if(moving) {
        var pos = (event.data.getLocalPosition(Game.app.stage));
        var newposx = (startpos.x + (startpos_mouse.x - pos.x)/SceneGameRender.gameView.zoom/Game.strechScale);
        var newposy = (startpos.y + (startpos_mouse.y - pos.y)/SceneGameRender.gameView.zoom);

        SceneGameRender.gameView.container.pivot.set(newposx, newposy)
      }
    })
  }

  static setCameraToCenterMap()
  {
    var size = [TileMap.mapSize.max_x-TileMap.mapSize.min_x, TileMap.mapSize.max_y-TileMap.mapSize.min_y];

    var w = TileMap.tileSize.width/2;
    var h = TileMap.tileSize.height/2;

    this.gameView.container.pivot.set(
      -1024/2 + ((size[0]-1)/2)*w - ((size[1]-1)/2)*w,
      -768/2 + ((size[1]-1)/2)*h + ((size[0]-1)/2)*h
    )
  }

  static tick(delta)
  {
  }

  static destroy()
  {
  }
}
