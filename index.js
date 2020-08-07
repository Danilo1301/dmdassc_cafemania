(() => {
  var html = "";
  fetch('assets.json').then(function(response) {
    response.json().then(function(json) {
      var promises = [];
      var promises_text = [];
      for (var c of json.classes) { promises.push(fetch('game/'+c+'.js')); }
      for (var c of json.scenes) { promises.push(fetch('game/scenes/'+c+'.js')); }
      Promise.all(promises).then((values) => {
        for (var val of values) { promises_text.push(val.text()) }
        Promise.all(promises_text).then((texts) => {
          for (var text of texts) {
            html += `\n\n//---------------------\n\n${text}`;
          }
          //html = `(() => {\n${html}\nGame.start()\n})()`;
          html = `${html}\nGame.start()`;
          var script = document.createElement("script");
          script.onload = function() { console.log("hm") }
          script.textContent = html;
          document.body.appendChild(script);

          script.remove();
        })
      })
    })
  })
})();
