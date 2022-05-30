class AStarPathfinder {
  constructor(grid) {
    this.grid = grid;
    this.openSet = new heapTree();
    this.pathIsFound = false;
  }

  findPath(origin, target, usePathCallback) {
    if (!origin || !target) return;

    const startTime = this.searchSetup(origin, target);

    while (true) {
      if (!this.searchLoop(origin, target)) break;
    }

    let path = [];
    if (this.pathIsFound) {
      path = this.tracePathBackToOrigin(origin, target);
    }

    this.finalizeSearch(startTime, path, usePathCallback);
  }

  searchSetup(origin, target) {
    this.pathIsFound = false;
    this.grid.path = [];
    this.grid.reset(true);
    origin.gCost = 0;
    origin.fCost = origin.gCost + origin.getEuclideanDistance(target);
    this.openSet.reset();
    this.openSet.push(origin);

    const startTime = Date.now();
    return startTime;
  }

  logPathTimeAndLenght(time, length) {
    // if (this.pathIsFound) {
    //   console.log(`Found path in: ${time} ms, length: ${length}`);
    //   return;
    // }
    // console.log(`Could not find the path :/`);
  }

  finalizeSearch(startTime, path, usePathCallback) {
    const length = path.length;
    this.logPathTimeAndLenght(Date.now() - startTime, length);
    if (length) usePathCallback(path);
  }

  searchLoop(origin, target) {
    let current = this.openSet.pullOutTheLowest();

    if (!current || !origin || !target) return false;

    if (current.id === target.id) {
      this.pathIsFound = true;

      return false;
    }

    current.wasVisisted = true;

    current.neighbours.forEach((node) => {
      if (node.wasVisisted) return;

      const newgCost = current.gCost + 1;
      const isNodeNOTInOpen = !this.openSet.items.some(
        (item) => item.id === node.id
      );
      if (isNodeNOTInOpen || newgCost < node.gCost) {
        node.gCost = newgCost;
        node.fCost = node.gCost + node.getEuclideanDistance(target);
        node.parent = current;
        if (isNodeNOTInOpen) {
          this.openSet.push(node);
        }
      }
    });

    return true;
  }

  tracePathBackToOrigin(origin, target) {
    const path = [];
    let current = target.parent;
    if (!current) {
      this.pathIsFound = false;
      return path;
    }
    while (current.id !== origin.id) {
      path.push(current);
      current = current.parent;
    }
    return path.reverse();
  }
}
