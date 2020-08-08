class SceneGameObjects {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static objects = [];
  static players = [];

  static setup()
  {

    for (var i = 0; i < 15; i++) {
      var player = new Player();
      player.generateSkin();
      player.container.position.set(1024/2+Math.getRandomInt(-300, 300), 768/2+Math.getRandomInt(-300, 300));

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
