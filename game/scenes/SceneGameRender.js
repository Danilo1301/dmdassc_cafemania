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



    Scenes.loadScene(SceneRenderPlayer);

    Scenes.loadScene(SceneTileMap, this.gameView);
    SceneTileMap.viewport.align = ALIGN.CENTER;

    Scenes.loadScene(SceneGameObjects, this.gameView);
    SceneGameObjects.viewport.align = ALIGN.CENTER;

    Scenes.loadScene(SceneHud);
    SceneHud.viewport.container.zIndex = 1000;
    SceneHud.viewport.align = ALIGN.RIGHT;
    SceneHud.viewport.keepAspect = true;

    this.viewport.container.interactive = true;
    this.viewport.container.on("mousemove", function(event) {
      var pos = (event.data.getLocalPosition(Game.app.stage));
      //SceneGameRender.gameView.zoom = (pos.x/1024 + 0.8).clamp(0.1, 2)
    })


    var moving = false;
    var startpos;
    var startpos_mouse;

    Game.app.stage.interactive = true;
    Game.app.stage.on("mousedown", function(event) {
      var pos = (event.data.getLocalPosition(Game.app.stage));

      moving = true;
      startpos = {x: SceneGameRender.gameView.position.x, y: SceneGameRender.gameView.position.y};
      startpos_mouse = pos;
      console.log(startpos, startpos_mouse)
    })
    Game.app.stage.on("mouseup", function(event) {
      moving = false;
    })

    Game.app.view.addEventListener('wheel', (ev) => {
      if(ev.wheelDelta > 0) {
        SceneGameRender.gameView.zoom += 0.1;
      } else {
        SceneGameRender.gameView.zoom -= 0.1;
      }

      SceneGameRender.gameView.zoom = SceneGameRender.gameView.zoom.clamp(0.1, 3)
    });



    Game.app.stage.on("mousemove", function(event) {

      if(moving) {
        var pos = (event.data.getLocalPosition(Game.app.stage));
        var newposx = startpos.x - (startpos_mouse.x - pos.x);
        var newposy = startpos.y - (startpos_mouse.y - pos.y);

        SceneGameRender.gameView.position.x = newposx;
        SceneGameRender.gameView.position.y = newposy;
      }
    })
  }

  static tick(delta)
  {
  }

  static destroy()
  {
  }
}
