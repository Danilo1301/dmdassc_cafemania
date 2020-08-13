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

    this.moneyText = new PIXI.Text('2', style);
    this.moneyText.x = 100;
    this.moneyText.y = 50;
    this.viewport.container.addChild(this.moneyText);

    this.elapsed = 0;

    Events.on("UPDATE_MONEY", function(ev) {
      SceneFPSCounter.moneyText.text = ev.money;
    });
  }

  static tick(delta)
  {
    this.elapsed += delta;

    if(this.elapsed > 20)
    {
      this.elapsed = 0;

      this.fpsText.text = Math.round(Game.app.ticker.FPS) + " FPS";

      if(Auth.isSignedIn) {
        this.fpsText.text += "\n"+Auth.getUserId();
      }
    }


  }

  static destroy()
  {
    this.fpsText.destroy();
  }
}
