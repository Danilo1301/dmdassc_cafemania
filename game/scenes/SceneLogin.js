class SceneLogin {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static setup()
  {
    this.background = PIXI.Sprite.from('assets/images/background1.png');
    this.viewport.container.addChild(this.background);

    this.menu = this.viewport.createParentViewport(1024, 768);
    this.menu.keepAspect = true;
    this.menu.align = ALIGN.CENTER;

    const style = new PIXI.TextStyle({
      fontFamily: 'segoe-ui-black',
      fontSize: 60,
      stroke: "#3c1905",
      strokeThickness: 12,
      align: "center",
      fill: ['#ffffff']
    });

    this.mainText = new PIXI.Text('Você não está logado!', style);
    this.mainText.x = 0;
    this.mainText.y = 0;
    this.mainText.anchor.set(0.5)
    this.mainText.position.set(this.menu.width/2, this.menu.height/2 - 100)
    this.menu.container.addChild(this.mainText);

    this.loginButton = this.gui.createButton(this.menu.width/2, this.menu.height/2 + 50, 400, 20, {background_src: "assets/images/button_signin_google.png"});
    this.gui.addToViewport(this.loginButton, this.menu);

    this.loginButton.onclick = function() {
      SceneLoadSign.text_sign = "Entrando";
      Scenes.loadScene(SceneLoadSign);

      Auth.signIn(function() {

        Scenes.destroyScene(SceneLoadSign);

        if(Auth.isSignedIn) {
          Scenes.destroyScene(SceneLogin);
          Scenes.loadScene(SceneLoad);
        }
      });
    }





  }

  static tick(delta)
  {
    this.mainText.updateText();
  }

  static destroy()
  {
    this.background.destroy();
    this.menu.destroy();
    this.mainText.destroy();
  }
}
