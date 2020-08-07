class Game {
	static app;
	static resolution = {width: 1024, height: 768}
	static viewport;

	static start()
	{
		Utils.setup();
		this.setupApp();

		this.viewport = Viewports.createViewport(Game.resolution.width, Game.resolution.height);

		//Scenes.loadScene(SceneFPSCounter);
		//SceneFPSCounter.viewport.keepAspect = true;
		//SceneFPSCounter.viewport.container.zIndex = 1000;


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
    this.app = new PIXI.Application({width: this.resolution.width, height: this.resolution.height, backgroundColor: 0x1099bb})
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
		//Gui.tick(delta);
	}

	static resize()
	{
		this.strechScale = Utils.resize(this.app.view, this.resolution).strechScale;
		this.app.renderer.resize(this.resolution.width, this.resolution.height);
	}
}

console.log("public reference")
