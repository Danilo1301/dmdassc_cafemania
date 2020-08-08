class SceneGameRender {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static setup()
  {
    this.viewport.align = ALIGN.CENTER;

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
      SceneGameRender.viewport.zoom = (pos.x/1024 + 0.8).clamp(0.1, 2)
    })
  }

  static tick(delta)
  {
  }

  static destroy()
  {
  }
}
