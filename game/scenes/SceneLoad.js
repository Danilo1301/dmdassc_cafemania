class SceneLoad {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static totalProgress;
  static loader;

  static loadAssets = {
    images: {
      "tile": "assets/images/tile.png",
      "outsidetile": "assets/images/outsidetile.png",
      "test_cooker": "assets/images/test_cooker.png",
      "button_confirm": "assets/images/button_confirm.png",
      "button_zoom_in": "assets/images/button_zoom_in.png",
      "button_zoom_out": "assets/images/button_zoom_out.png",
      "wallback": "assets/images/wallback.png",
      "wallmask": "assets/images/wallmask.png"
    }
  }

  static addLoadImage(name, src)
  {
    this.loader.add(name, src);
    this.totalProgress[1]++;
  }

  static setup()
  {
    this.totalProgress = [0, 0];
    this.loader = new PIXI.Loader();

    this.background = new PIXI.Sprite(Game.resources["background1"].texture);
    this.viewport.container.addChild(this.background);

    this.menu = this.viewport.createParentViewport(1024, 768);
    this.menu.keepAspect = true;
    this.menu.align = ALIGN.CENTER;

    this.background2 = new PIXI.Sprite(Game.resources["background2"].texture);
    this.background2.anchor.set(0.5)
    this.background2.position.set(this.menu.width/2, this.menu.height/2)
    this.menu.container.addChild(this.background2);

    this.loadbar = this.gui.createLoadbar(this.menu.width/2, 669, 495, 30, {texture: "loadbar1"});
    this.gui.addToViewport(this.loadbar, this.menu);

    var style = new PIXI.TextStyle({
      fontFamily: 'segoe-ui-black',
      fontSize: 40,
			stroke: "#3c1905",
			lineJoin: "round",
      strokeThickness: 12,
      align: "left",
      fill: ['#ffffff']
    });

    this.loadText = new PIXI.Text('0%', style);
    this.loadText.position.set(this.menu.width/2, 705);
    this.loadText.anchor.set(0.5);
    this.menu.container.addChild(this.loadText);

    console.log("Getting user info...")

    Net.emit("login", {id: Auth.getUserId()}, this.onReceiveInfo.bind(this));
  }

  static onReceiveInfo(info)
  {
    GameLogic.gameData = Game.data = info.data;
    GameLogic.userData = info.userData;

    PlayerSkins.setupSkins(info.data.player);

    for (var image in this.loadAssets.images) { this.addLoadImage(image, this.loadAssets.images[image]); }

    for (var tileItemId in Game.data.tileItems) {
      this.addLoadImage(
        `tileitem:${tileItemId}`,
        Net.server_address + "/data/" + Game.data.tileItems[tileItemId].path + "/image.png"
      );
    }

    for (var sheet_name in PlayerSkins.sheets) {
      var sheet = PlayerSkins.sheets[sheet_name];
      this.addLoadImage(
        sheet.name,
        Net.server_address + "/data/player/" + sheet.src
      );
    }


    this.loader.onProgress.add(() => { this.totalProgress[0]++; });

    this.loader.load( this.onFinishLoad.bind(this) );
  }

  static onFinishLoad(loader, resources)
  {
    for(var sheet of PlayerSkins.sheets)
    {
      sheet.texture = resources[sheet.name].texture;
    }

    Game.addResources(resources);

    console.log("[SceneLoad] Load finished")
    Scenes.destroyScene(SceneLoad);
    Scenes.loadScene(SceneGameRender);
  }

  static tick(delta)
  {

    this.loadbar.setProgress((this.totalProgress[0]/this.totalProgress[1]) || 0);
    this.loadText.text = (Math.round(this.loadbar.progress*100) || 0) + "%";
  }

  static destroy()
  {
    this.background.destroy();
    this.menu.destroy();
    this.background2.destroy();
    this.loadText.destroy();
  }
}
