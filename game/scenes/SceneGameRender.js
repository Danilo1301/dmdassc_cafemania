class SceneGameRender {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static setup()
  {
    this.gameView = this.viewport.createParentViewport(1024, 768);
    this.gameView.keepAspect = true;
    this.gameView.align = ALIGN.CENTER;

    Scenes.loadScene(SceneTileMap, this.gameView);
    Scenes.loadScene(SceneGameObjects, this.gameView);

    this.viewport.container.interactive = true;
    this.viewport.container.on("mousemove", function(event) {
      var pos = (event.data.getLocalPosition(SceneGameRender.viewport.container));

      console.log(pos)

      SceneGameRender.gameView.position.x = pos.x - 1024/2;
      SceneGameRender.gameView.position.y = pos.y - 768/2;
    })

  }

  static tick(delta)
  {
  }

  static destroy()
  {
  }
}
