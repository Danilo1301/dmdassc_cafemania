class PathFind {
  constructor(x, y, endx, endy)
  {
    this.completed = false;
    this.cameFrom = {};
    this.start_node = TileMap.path_find_tiles[`${x}:${y}`];
    this.goal_node = TileMap.path_find_tiles[`${endx}:${endy}`];
    this.openSet = [this.start_node];
    this.closedSet = [];
    this.nodes = {};

    this.scores = {};

    this.closestNode = null;
  }

  run(callback)
  {
    this.callback = callback;

    this.update();
  }

  update()
  {
    if(this.completed) {
      return
    }

    var node = this.openSet[0];

    if(!node) {
      this.reversePath(this.closestNode);
      return
    }

    if(node == this.goal_node) {
      return this.reversePath(node);
    }

    for (var neighbour of node.neighbours)
    {
      if(!this.openSet.includes(neighbour) && !this.closedSet.includes(neighbour))
      {
        if(neighbour.walkable || neighbour == this.goal_node) {
          this.getScores(neighbour);

          if(!this.closestNode) { this.closestNode = neighbour; }
          if(this.scores[neighbour.key].f <= this.scores[this.closestNode.key].f) { this.closestNode = neighbour; }

          this.cameFrom[neighbour.key] = node.key;
          this.openSet.push(neighbour);
        }
      }

      if(neighbour == this.goal_node) {
        return this.reversePath(neighbour);
      }
    }

    this.openSet.splice(0, 1);
    this.closedSet.push(node);

    this.update();
  }

  getScores(node)
  {
    var scores = {};

    var dx = node.x - this.start_node.x;
    var dy = node.y - this.start_node.y;

    scores.f = Math.sqrt(dx*dx + dy*dy);

    this.scores[node.key] = scores;
  }

  reversePath(node)
  {
    this.completed = true;

    var path = [];

    if(!node) {
      return this.callback(path);
    }


    var i = 0;
    var key = node.key;
    while (key) {
      path.unshift(key);
      var cameFromKey = this.cameFrom[key];
      key = cameFromKey;
    }

    if(this.callback) {
      this.callback(path);
    }
  }
}
