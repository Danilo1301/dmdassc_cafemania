class SceneGameObjects {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static setup()
  {
    //Scenes.destroyScene(SceneFPSCounter);

    this.player = new Player();
    this.viewport.container.addChild(this.player.container);
    this.player.container.x = this.viewport.width/2
    this.player.container.y = this.viewport.height/2;
    this.player.generateSkin();

    this.player.skins.head.push({layer: "1.layer.eyes", skin: "0.skin.default"})
    this.player.skins.head.push({layer: "2.layer.mouth", skin: "0.skin.default"})
    this.player.skins.head.push({layer: "3.layer.eyebrow", skin: "0.skin.default"})
    this.player.skins.head.push({layer: "4.layer.hair", skin: "0.skin.default"})
    this.player.skins.arms.push({layer: "1.layer.cloth", skin: "0.skin.default"})

    this.player.generateSkin()
  }

  static tick(delta)
  {
  }

  static destroy()
  {
  }
}
