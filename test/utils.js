function Point() {
  this.set = (x, y) => {
    this.x = x;
    this.y = y;
  };
}

class TestDisplayElement {

  constructor() {
    this.children = [];
    this.parent = null;
    this.scale = new Point();
  }

  addChild(child) {
    child.parent = this;
    this.children.push(child);
  };

  addChildAt(child, index) {
    child.parent = this;
    this.children.splice(index, 0, child);
  }

  removeChild(child) {
    child.parent = null;
    this.children.slice(this.children.indexOf(child), 1);
  };
  
}

class TestSprite extends TestDisplayElement {
  constructor(texture) {
    super();
    this.tag = 'sprite';
    this.texture = texture;
  }
}

export function makeContainer() {
  return new TestDisplayElement();
}

export function makeSprite(texture) {
  return new TestSprite(texture);
};

export function testCreateElement(tag, texture) {
  switch (tag) {
  case 'container':
    return makeContainer();
  case 'sprite':
    return makeSprite(texture);
  case 'g':
    return makeContainer();
  default:
    throw new Error('unknown tag');
  }
}
