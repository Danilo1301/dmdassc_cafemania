class SceneGameObjects {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static objects = [];
  static players = [];

  static setup()
  {
    for (var i = 0; i < 20; i++) {
      var player = new Player();

      player.targetPos = {x: 1024/2, y: 768/2};
      player.position = {x: 1024/2, y: 768/2};



      player.skins.head.push({layer: "1.layer.eyes", skin: "0.skin.default"})
      player.skins.head.push({layer: "2.layer.mouth", skin: "0.skin.default"})
      player.skins.head.push({layer: "3.layer.eyebrow", skin: "0.skin.default"})
      player.skins.head.push({layer: "4.layer.hair", skin: "0.skin.default"})
      player.skins.arms.push({layer: "1.layer.cloth", skin: "0.skin.default"})
      player.generateSkin();

      

      this.players.push(player);

      this.addObject(player);
    }


  }

  static addObject(object)
  {
    this.objects.push(object);
    this.viewport.container.addChild(object.container);
  }

  static tick(delta)
  {
    this.viewport.container.children.sort((itemA, itemB) => itemA.position.y - itemB.position.y);

    for (var object of this.objects) {
      object.update(delta);
    }
  }

  static destroy()
  {
  }
}
