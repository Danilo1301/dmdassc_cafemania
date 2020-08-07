class SceneLoadSign {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static background;
  static menu;

  static text_sign = "Conectando";
  static text_dots = "";

  static setup()
  {
    this.background = PIXI.Sprite.from('assets/images/background1.png');
    this.viewport.container.addChild(this.background);

    this.menu = this.viewport.createParentViewport(1024, 768);
    this.menu.keepAspect = true;
    this.menu.align = ALIGN.CENTER;

    this.sign = PIXI.Sprite.from('assets/images/sign1.png');
    this.sign.anchor.set(0.5)
    this.sign.position.set(this.menu.width/2, this.menu.height/2)
    this.menu.container.addChild(this.sign);

    const style = new PIXI.TextStyle({
      fontFamily: 'segoe-ui-black',
      fontSize: 60,
      lineHeight: 55,
      align: "center",
      fill: ['#ffffff']
    });

    this.signText = new PIXI.Text('', style);
    this.signText.x = this.menu.width/2;
    this.signText.y = this.menu.height/2 + 10;
    this.signText.anchor.set(0.5)
    this.menu.container.addChild(this.signText);
  }

  static tick(delta)
  {
    var dots = Math.ceil((Game.app.ticker.lastTime%2000)/(2000/4));
    this.text_dots = "";
    for (var i = 0; i < dots-1; i++) { this.text_dots += "."; }

    this.signText.text = `${this.text_sign}\n${this.text_dots}`;
  }

  static destroy()
  {
    this.menu.destroy();
    this.background.destroy();
    this.sign.destroy();
    this.signText.destroy();
  }
}
