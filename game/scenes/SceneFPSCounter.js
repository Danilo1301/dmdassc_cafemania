class SceneFPSCounter {
  static resolution = {width: 400, height: Game.resolution.height};
  static viewport;
  static gui;

  static setup()
  {
    const style = new PIXI.TextStyle({
      fontFamily: 'segoe-ui-black',
      fontSize: 18,
			stroke: "#3c1905",
			lineJoin: "round",
      strokeThickness: 8,
      align: "left",
      fill: ['#ffffff']
    });

    this.fpsText = new PIXI.Text('', style);
    this.fpsText.x = 0;
    this.fpsText.y = 0;
    this.viewport.container.addChild(this.fpsText);
  }

  static tick(delta)
  {
    this.fpsText.text = Math.round(Game.app.ticker.FPS) + " FPS";

    if(Auth.isSignedIn) {
      this.fpsText.text += "\n"+Auth.auth2.currentUser.get().getId();
    }
  }

  static destroy()
  {
    this.fpsText.destroy();
  }
}
