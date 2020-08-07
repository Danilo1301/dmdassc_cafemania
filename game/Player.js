class Player {
  constructor()
  {
    this.position = {x: 0, y: 0}
    this.sprite_textures = [];
    this.skins = {
      head: [
        {layer: "0.layer.skin", skin: "0.skin.default"},
        //{layer: "1.layer.eyes", skin: "0.skin.default"},
        //{layer: "2.layer.mouth", skin: "0.skin.default"},
        //{layer: "3.layer.eyebrow", skin: "0.skin.default"},
        //{layer: "4.layer.hair", skin: "0.skin.default"}
      ],
      body: [
        {layer: "0.layer.skin", skin: "0.skin.default"},
        //{layer: "1.layer.cloth", skin: "0.skin.default"}
      ],
      arms: [
        {layer: "0.layer.skin", skin: "0.skin.default"},
        //{layer: "1.layer.cloth", skin: "0.skin.default"}
      ],
      legs: [
        {layer: "0.layer.skin", skin: "0.skin.default"},
        //{layer: "1.layer.cloth", skin: "0.skin.default"},
        //{layer: "2.layer.shoes", skin: "0.skin.default"}
      ]
    }

    this.baseRender = {
      objects: [],
      layerSprites: []
    }



    this.container = new PIXI.Container();
    //this.container.pivot.set(150, 200);
    this.renderContainer = new PIXI.Container();

    this.bg = new PIXI.Graphics();
    this.bg.beginFill(0xFF0000);
    this.bg.drawRect(0, 0, 100, 150);
    this.bg.endFill();
    this.bg.alpha = 0.3
    this.container.addChild(this.bg);




    this.goToRandomTile();
  }

  goToRandomTile()
  {
    var tile = SceneTileMap.tiles[Math.getRandomInt(0, SceneTileMap.tiles.length-1)];
    this.targetPos = {x: tile.x, y: tile.y};

    setTimeout(() => { this.goToRandomTile(); }, Math.getRandomArbitrary(5000, 10000))
  }

  genSingleSkinFrames(part, bodyPart, layer, skin)
  {
    var frames = [];

    var sheet_library = Game.data.player[part].layers[layer].skins[skin];


    for (var anim in Game.data.animations) {
      var animData = Game.data.animations[anim];
      var texture_name = sheet_library[anim + "." + bodyPart];
      var sheet = Game.resources[ texture_name ].texture;

      for (var i_y = 0; i_y < (animData.views.length); i_y++) {
        for (var i_x = 0; i_x < (animData.to-animData.from+1); i_x++) {
          var frame = new PIXI.Texture(sheet, new PIXI.Rectangle(i_x*300, i_y*400, 300, 400));
          this.baseRender.objects.push(frame);
          frames.push(frame);
        }
      }

    }

    return frames;

  }

  genBodyPart(part)
  {
    var layers = {
      "Head": 5,
      "ArmR": 4,
      "Body": 3,
      "ArmL": 2,
      "LegR": 1,
      "LegL": 0
    }

    var tint = Math.getRandomInt(0xFFFFFF, 0x000000);

    var bodyParts = Game.data.player[part].parts;
    for (var bodyPart of bodyParts) {



      for (var layer of this.skins[part]) {

        var layerSprites = {container: new PIXI.Container()}

        this.baseRender.objects.push(layerSprites.container);

        layerSprites.container.zIndex = layers[bodyPart];

        var frames = this.genSingleSkinFrames(part, bodyPart, layer.layer, layer.skin);

        for (var frame of frames) {
          var sprite = new PIXI.Sprite(frame);
          sprite.tint = tint;
          layerSprites.container.addChild(sprite);

          this.baseRender.objects.push(sprite);
        }

        this.baseRender.layerSprites.push(layerSprites)
        this.renderContainer.addChild(layerSprites.container)

      }

    }
  }

  generateSkin()
  {
    for (var o of this.sprite_textures) { o.destroy(); }
    this.sprite_textures = [];

    for (var skin_part in this.skins) {
      this.genBodyPart(skin_part);
    }

    this.generateSprite();

    for (var o of this.baseRender.objects) { o.destroy(); }
    this.baseRender.objects = [];
    this.baseRender.layerSprites = [];

    console.log(this.baseRender)
  }

  generateSprite()
  {
    this.renderContainer.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);


    for (var i = 0; i < this.baseRender.layerSprites[0].container.children.length; i++) {
      this.gotoFrame(i);

      var texture = new PIXI.RenderTexture( new PIXI.BaseRenderTexture(300, 400, PIXI.SCALE_MODES.LINEAR, 1) );
      //texture.defaultAnchor.x = 20


      Game.app.renderer.render(this.renderContainer, texture);

      this.sprite_textures.push(texture);
    }

    if(this.sprite) { this.sprite.destroy(); }

    this.sprite = new PIXI.AnimatedSprite(this.sprite_textures);
    this.sprite.animationSpeed = 0.08;

    this.sprite.scale.set(0.5);
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(100/2, 150/2);

    //this.sprite.scale.set(0.8)
    //this.sprite.anchor.set(0.5);
    this.sprite.gotoAndPlay(Math.getRandomInt(0, this.sprite_textures.length-1));
    this.container.addChild(this.sprite);
    this.container.pivot.set(100/2, 150-25);



  }

  update(delta)
  {
    if(this.position.x < this.targetPos.x) { this.position.x += 1; }
    if(this.position.x > this.targetPos.x) { this.position.x -= 1; }
    if(this.position.y < this.targetPos.y) { this.position.y += 1; }
    if(this.position.y > this.targetPos.y) { this.position.y -= 1; }

    this.container.x = this.position.x;
    this.container.y = this.position.y;

    //this.debugText.text = `${this.position.x}, ${this.position.y}\n${this.container.zIndex}`;
  }

  gotoFrame(n)
  {

    for (var layerSprites of this.baseRender.layerSprites) {

      for (var sprite of layerSprites.container.children) {
        sprite.visible = false;
      }

      layerSprites.container.children[n].visible = true;
    }
  }
}
