class Game {
	static app;
	static resolution = {width: 1024, height: 768}
	static viewport;
	static resources = {};

	static addResources(resources)
	{
		for (var resource in resources) {
			this.resources[resource] = resources[resource];
		}
	}

	static start()
	{
		Utils.setup();
		this.setupApp();

		this.viewport = Viewports.createViewport(Game.resolution.width, Game.resolution.height);

		var loader = new PIXI.Loader;

		loader.add("background1", "assets/images/background1.png");
		loader.add("background2", "assets/images/background2.png");
		loader.add("sign1", "assets/images/sign1.png");
		loader.add("loadbar1", "assets/images/loadbar1.png");
		loader.add("loadbar2", "assets/images/loadbar2.png");
		loader.add("loadbar_mask1", "assets/images/loadbar_mask1.png");

		loader.load(function(loader, resources) {
			Game.addResources(resources);
			Game.onFinishPreload();
		});
	}

	static onFinishPreload()
	{
		Scenes.loadScene(SceneFPSCounter);
		SceneFPSCounter.viewport.keepAspect = true;
		SceneFPSCounter.viewport.container.zIndex = 1000;


		Scenes.loadScene(SceneLoadSign);

		Net.connect(function() {

      Auth.load(function() {

				Scenes.destroyScene(SceneLoadSign);

				if(!Auth.isSignedIn)
				{
					Scenes.loadScene(SceneLogin);
					return
				}

				Scenes.loadScene(SceneLoad);
      });
    });
	}


	static setupApp()
	{
		PIXI.utils.skipHello();
		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    this.app = new PIXI.Application({ transparent: true, width: this.resolution.width, height: this.resolution.height})
    this.app.start();
		this.app.view.style.width = "100%";
		this.app.view.style.height = "100%";
		this.app.ticker.add(this.tick, this);
		window.addEventListener('resize', () => this.resize());
		document.getElementById("area").appendChild(this.app.view);
		this.resize();
	}

	static tick(delta)
	{
		Scenes.tick(delta);
		Viewports.tick(delta);
		ObjectOrigin.update();

		Events.clear();
		//Gui.tick(delta);
	}

	static resize()
	{
		this.strechScale = Utils.resize(this.app.view, this.resolution).strechScale;
		this.app.renderer.resize(this.resolution.width, this.resolution.height);
	}
}

console.log("public reference")
