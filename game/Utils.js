class Utils {
  static setup()
  {
    Math.lerp = function(value1, value2, amount) {
    	amount = amount < 0 ? 0 : amount;
    	amount = amount > 1 ? 1 : amount;
    	return value1 + (value2 - value1) * amount;
    };

    Number.prototype.clamp = function(min, max) {
      return Math.min(Math.max(this, min), max);
    };

    Math.getRandomArbitrary = function(min, max) {
      return Math.random() * (max - min) + min;
    }

    Math.getRandomInt = function(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }

  static resize(canvas, resolution)
  {
  	var canvas;
  	var area = document.getElementById("area");

  	var widthToHeight = resolution.width/resolution.height;
  	var newWidth = window.innerWidth;
  	var newHeight = window.innerHeight;
  	var newWidthToHeight = newWidth / newHeight;

    var strechScale = 1;

  	if (newWidthToHeight > widthToHeight) {
  		newWidth = newHeight * widthToHeight;
      newWidth = window.innerWidth;

      var pa = newHeight * widthToHeight;
      strechScale = pa / window.innerWidth;

      area.style.width = newWidth + 'px';
  		area.style.height = newHeight + 'px';
  	} else {
  		newHeight = newWidth / widthToHeight;
  		area.style.width = newWidth + 'px';
  		area.style.height = newHeight + 'px';
  	}

    area.style.marginTop = (-newHeight / 2) + 'px';
    area.style.marginLeft = (-newWidth / 2) + 'px';


  	canvas.width = newWidth;
  	canvas.height = newHeight;

  	var scale = {
  		x: newWidth/resolution.width,
  		y: newHeight/resolution.height
  	}
  	return {scale: scale, width: newWidth, height: newHeight, strechScale: strechScale};
  }
}
