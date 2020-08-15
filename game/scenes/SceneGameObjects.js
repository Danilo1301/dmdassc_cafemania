class SceneGameObjects {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static objects = [];
  static players = [];

  static setup()
  {
  }

  static createPlayers()
  {
    for (var i = 0; i < 15; i++) {
      var player = new Player();
      player.generateSkin();
      player.container.position.set(-500, 0);

      this.addObject(player);

      this.players.push(player);

      RandomPlayerAction.startForPlayer(player);
    }
  }

  static addObject(object)
  {
    this.objects.push(object);
    this.viewport.container.addChild(object.container);
  }

  static tick(delta)
  {

    this.viewport.container.children.sort((itemA, itemB) => {
      return itemA.position.y - itemB.position.y;
    });

    for (var object of this.objects) {
      if(object.update) {
        object.update(delta);
      }

    }
  }

  static destroy()
  {
  }
}
