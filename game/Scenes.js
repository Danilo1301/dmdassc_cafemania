class Scenes {
  static activeScenes = [];

  static loadScene(scene, atViewport)
  {
    atViewport = atViewport || Game.viewport;

    scene.viewport = Viewports.createViewport(scene.resolution.width, scene.resolution.height);
    scene.gui = new Gui(scene.viewport);
    scene.setup();
		scene.viewport.parentOf = atViewport;
		atViewport.container.addChild(scene.viewport.container);
		Scenes.activeScenes.push(scene);
  }

  static destroyScene(scene)
  {
    scene.viewport.destroy();
    scene.gui.destroy();
    scene.destroy();
		scene.viewport.parentOf = null;
		Game.viewport.container.removeChild(scene.viewport.container);
		Scenes.activeScenes.splice(Scenes.activeScenes.indexOf(scene), 1);
  }

  static tick(delta)
  {
    for (var scene of this.activeScenes) {
      scene.tick(delta);
      if(scene.gui) { scene.gui.update(delta); }

    }
  }
}
