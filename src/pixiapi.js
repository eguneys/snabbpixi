import * as PIXI from 'pixi.js';

function createContainer() {
  return new PIXI.Container();
}

export function createSprite(texture) {
  return new PIXI.Sprite(texture);
}

export function createElement(tag, texture, data) {
  switch (tag) {
  case 'sprite':
    return createSprite(texture);
  case 'container':
    return createContainer();
  default:
    throw new Error('Unknown Pixi element tag ' + tag);
  }
}

function parentNode(child) {
  return child.parent;
}

function removeChild(node, child) {
  node.removeChild(child);
}

function addChild(node, child) {
  node.addChild(child);
}

function addChildBefore(node, child, before) {
  if (before) {
    before = node.children.indexOf(before);
    node.addChildAt(child, before);
  } else {
    node.addChild(child);
  }
}

function setDataContent(elm, data) {
  elm.x = data.x || 0;
  elm.y = data.y || 0;
  if (data.width) elm.width = data.width;
  if (data.height) elm.height = data.height;
  if (data.scale) elm.scale.set(data.scale.x, data.scale.y);
  if (data.alpha) elm.alpha = data.alpha;
  if (data.anchor) elm.anchor = data.anchor;
  if (elm.setData) elm.setData(data);
}

export const makePixiApi = (createElement) => ({
  createElement,
  parentNode,
  addChild,
  addChildBefore,
  removeChild,
  setDataContent
});

export default makePixiApi(createElement);
