class SceneLoad {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static loadAssets = {
    images: {
      "tile": "assets/images/tile.png",
      "test_cooker": "assets/images/test_cooker.png"
    }
  }

  static setup()
  {
    var self = this;

    this.totalProgress = [0, 0];

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

    Net.emit("login", {id: Auth.auth2.currentUser.get().getId()}, function(info) {
      Game.data = info.data;

      self.images = {};

      for (var part in info.data.player) {
        for (var layer in info.data.player[part].layers) {
          for (var skin in info.data.player[part].layers[layer].skins) {
            for (var bodyPart of info.data.player[part].parts) {
              for (var anim in info.data.animations) {
                var src = `${Net.server_address}/data/player/${part}/${layer}/${skin}/${anim}_${bodyPart}.png`;
                var name = `player_sheet.${part}:${layer}:${skin}:${anim}:${bodyPart}`;
                self.images[name] = {name: name, src: src, target: info.data.player[part].layers[layer].skins[skin], part: part, layer: layer, skin: skin, bodyPart: bodyPart, anim: anim}
              }
            }
          }
        }
      }



      const loader = new PIXI.Loader();

      for (var image in self.loadAssets.images) {
        loader.add(image, self.loadAssets.images[image]);
        self.totalProgress[1]++;
      }

      for (var image_name in self.images) {
        var image = self.images[image_name];

        loader.add(image.name, image.src)
        self.totalProgress[1]++;
      }

      loader.onProgress.add(() => {
        self.totalProgress[0]++;
      });

      loader.load((loader, resources) => {
        Game.addResources(resources);

        for (var res in resources) {
          var sheet = self.images[res];
          if(!sheet) { continue };
          sheet.target[sheet.anim + "." + sheet.bodyPart] = sheet.name;
        }

        self.onFinishLoad();
      });

    });
  }

  static onFinishLoad()
  {

    console.log("[SceneLoad] Load finished")
    Scenes.destroyScene(SceneLoad);
    Scenes.loadScene(SceneGameRender);
  }

  static tick(delta)
  {
    this.loadbar.setProgress(this.totalProgress[0]/this.totalProgress[1]);
    this.loadText.text = (Math.round(this.loadbar.progress*100) || 0) + "%";

    if(this.loadbar.progress >= 1) {
      //Scenes.destroyScene(SceneLoad);
    }
  }

  static destroy()
  {
    this.background.destroy();
    this.menu.destroy();
    this.background2.destroy();
    this.loadText.destroy();
  }
}
