class SceneRenderPlayer {
  static resolution = {width: 100, height: 150};
  static viewport;
  static gui;

  static canvas;
  static ctx;

  static layers = {
    "Head": 5,
    "ArmR": 4,
    "Body": 3,
    "ArmL": 2,
    "LegR": 1,
    "LegL": 0
  }

  static setup()
  {
    this.canvas = document.createElement("canvas");
    this.canvas.style.background = "gray";

    this.ctx = this.canvas.getContext("2d");
    //document.body.append(this.canvas);

  }

  static addQueryPlayer(player)
  {

    var renderableParts = this.getRenderableParts(player.skins);

    this.canvas.width = 2000;
    this.canvas.height = 2000;

    var datas = [];

    for (var anim_name in Game.data.animations) {
      datas = datas.concat(this.renderAnimFrames(renderableParts, anim_name));
    }

    var canvas = document.createElement("canvas");

    var w = 150;
    var h = 200;

    canvas.width = w*datas.length;
    canvas.height = h;

    var ctx = canvas.getContext("2d");

    var texture_base = PIXI.Texture.from(canvas);

    var textures = [];

    for (var data of datas) {
      ctx.putImageData(data, datas.indexOf(data)*w, 0);
      var t32Rect = new PIXI.Rectangle(datas.indexOf(data)*w, 0, w, h);
      textures.push(new PIXI.Texture(texture_base, t32Rect));
    }

    player.createSprite(texture_base, textures);
  }


  static renderAnimFrames(renderableParts, anim)
  {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    var toDraw = [];
    for (var layer in this.layers) { toDraw.unshift(layer) }
    for (var layer of toDraw) {
      this.renderPart(renderableParts[layer], anim);
    }

    var animData = Game.data.animations[anim];

    var ix = animData.to-animData.from+1;
    var iy = animData.views.length;

    var datas = [];

    var w = 150;
    var h = 200;

    for (var y = 0; y < iy; y++) {
      for (var x = 0; x < ix; x++) {
        datas.push(this.ctx.getImageData(x*w, y*h, 150, 200))
      }
    }

    return datas
  }

  static renderPart(part, anim)
  {
    for (var layer of part.layers) {
      var image = layer[anim];
      this.ctx.drawImage(image, 0, 0, image.width/2, image.height/2);
    }
  }

  static getRenderableParts(options)
  {
    var renderableParts = {};

    var totalLayers = {};
    var datas = [];

    for (var option of options) {
      for (var bodyPart of Game.data.player[option.part].parts) {
        if(!totalLayers[bodyPart]) { totalLayers[bodyPart] = 0; }
        var data = {part: bodyPart, index_layer: totalLayers[bodyPart], part_layer: this.layers[bodyPart], images: {}};
        totalLayers[bodyPart]++;
        for (var anim_name in Game.data.animations) {
          var resource_name = `player_sheet.${option.part}:${option.skin}:${anim_name}:${bodyPart}`;
          var resource = Game.resources[resource_name];
          data.images[anim_name] = resource.data;
          datas.push(data);
        }
      }
    }


    var renderableParts = {};
    for (var data of datas) {
      if(!renderableParts[data.part]) {
        renderableParts[data.part] = {
          layers: []
        };
      }
      renderableParts[data.part].layer = data.part_layer;
      renderableParts[data.part].layers[data.index_layer] = data.images;
    }

    return renderableParts;
  }

  static startRenderPlayer(player)
  {
    console.log(player);
  }

  static tick(delta)
  {
  }

  static destroy()
  {
  }
}
