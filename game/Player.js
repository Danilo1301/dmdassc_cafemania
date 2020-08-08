class Player {
  constructor()
  {
    this.position = {x: 0, y: 0};

    this.skins = [];
    this.skins.push({part:"head", skin: "0.layer.skin:0.skin.default"});
    this.skins.push({part:"body", skin: "0.layer.skin:0.skin.default"});
    this.skins.push({part:"arms", skin: "0.layer.skin:0.skin.default"});
    this.skins.push({part:"legs", skin: "0.layer.skin:0.skin.default"});
    if(Math.random() > 0.5) {
      if(Math.random() > 0.5) {
        this.skins.push({part:"head", skin: "1.layer.eyes:0.skin.default"});
      } else {
        this.skins.push({part:"head", skin: "1.layer.eyes:1.skin.red"});
      }

      this.skins.push({part:"head", skin: "2.layer.mouth:0.skin.default"});
      this.skins.push({part:"head", skin: "4.layer.hair:0.skin.default"});

      this.skins.push({part:"body", skin: "1.layer.cloth:0.skin.default"});
      this.skins.push({part:"arms", skin: "1.layer.cloth:0.skin.default"});

      this.skins.push({part:"legs", skin: "1.layer.cloth:0.skin.default"});
      this.skins.push({part:"legs", skin: "2.layer.shoes:0.skin.default"});
    }

    this.container = new PIXI.Container();
    this.container.scale.set(1);

    var background = new PIXI.Graphics();
    background.beginFill(0xFF0000);
    background.drawRect(0, 0, 100, 150);
    background.endFill();
    background.alpha = 0.2;
    this.container.addChild(background);
  }

  update(delta)
  {

  }

  generateSkin()
  {
    SceneRenderPlayer.addQueryPlayer(this);
  }

  createSprite(texture_base, textures)
  {
    this.texture_base = texture_base;

    this.sprite = new PIXI.AnimatedSprite(textures);
    this.sprite.animationSpeed = 0.08;
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(100/2, 150/2);

    this.container.addChild(this.sprite);

    this.sprite.gotoAndPlay(Math.getRandomInt(0, textures.length-1));
  }
}
