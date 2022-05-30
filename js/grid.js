class Grid {
  constructor({ height = 32, width = 32 }) {
    this.height = height;
    this.neighbourAddressMods = [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ];
    this.nodes = [[]];
    this.origin = null;
    this.path = [];
    this.target = null;
    this.width = width;
  }

  drawGrid(size) {
    const rows = this.nodes.length;
    const columns = this.nodes[0].length;
    let r = 0;
    let c = 0;

    for (r; r < rows; r++) {
      canvas.drawLine(r * size, 0, r * size, columns * size, '#d1d1d1');
    }

    for (c; c < columns; c++) {
      canvas.drawLine(0, c * size, rows * size, c * size, '#d1d1d1');
    }
  }

  drawNodes(size) {
    this.nodes.forEach((row) => {
      row.forEach((node) => {
        const { x, y } = node;

        const isPartOfPath =
          this.path && this.path.some((pathNode) => pathNode.id === node.id);
        ctx.fillStyle = isPartOfPath ? '#ff0000' : node.color;
        ctx.fillRect(x * size, y * size, size, size);
      });
    });
  }

  setOrigin(origin) {
    this.origin = origin;
    this.origin.color = '#0055FF';
    this.origin.isObstacle = false;
  }

  setTarget(target) {
    this.target = target;
    this.target.color = '#FF0000';
    this.target.isObstacle = false;
  }

  getCellUnderPointer(x, y, cellSize) {
    const row = Math.floor(y / cellSize);
    const column = Math.floor(x / cellSize);

    if (this.nodes[column] && this.nodes[column][row]) {
      return this.nodes[column][row];
    }

    return null;
  }

  findNeighbours() {
    const mods = this.neighbourAddressMods;
    const { nodes } = this;

    nodes.forEach((row) => {
      row.forEach((node) => {
        mods.forEach((mod) => {
          const row = node.x + mod[0];
          const column = node.y + mod[1];

          if (nodes[row] && nodes[row][column]) {
            const potential = nodes[row][column];

            if (!potential.isObstacle) {
              node.neighbours.push(potential);
            }
          }
        });
      });
    });
  }

  loadSavedMap(map, cellSize) {
    this.nodes = [];

    let idCounter = 0;
    this.nodes = map.map((row, x) =>
      row.map((isObstacle, y) => {
        const copy = new Node(
          x,
          y,
          cellSize,
          isObstacle === 1 ? true : false,
          idCounter
        );
        idCounter++;

        return copy;
      })
    );

    this.findNeighbours();
    this.setOrigin(this.nodes[0][0]);
    this.setTarget(this.nodes[0][this.height - 1]);
  }

  reset(shouldKeepOriginAndTarget) {
    this.nodes.forEach((row) => {
      row.forEach((node) => {
        if (!node.isObstacle) {
          node.wasVisisted = false;
          node.gCost = null;
          node.hCost = null;
          node.fCost = null;
          if (shouldKeepOriginAndTarget) {
            if (node.id !== this.origin.id && node.id !== this.target.id)
              node.color = 'transparent';
          } else {
            node.color = 'transparent';
          }
        }
      });
    });
  }
}
