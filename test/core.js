import { testBrowser } from 'testiz';

const { log, ok, is, deep_is, not } = testBrowser; 

import { init } from '../src/snabbpixi';
import { h } from '../src/snabbpixi';

import { testCreateElement, makeContainer } from './utils';

import { makePixiApi } from '../src/pixiapi';

const testPixiApi = makePixiApi(testCreateElement);

const patch = init([], testPixiApi);

const texture = _ => _.texture;

export default function test() {

  log('snabbpixi');

  let elm;

  withVnode('created element', vnode0 => {

    elm = patch(vnode0, h('sprite')).elm;
    is('has tag', elm.tag, 'sprite');
  });

  withVnode('receives properties', vnode0 => {
    elm = patch(vnode0, h('sprite', {
      texture: 'texture',
      x: 10,
      y: 11,
      width: 1,
      height: 1,
      scale: { x: 2, y: 2 },
      alpha: 2
    })).elm;

    is('x', elm.x, 10);
    is('y', elm.y, 11);
    is('w', elm.width, 1);
    is('h', elm.height, 1);
    is('s', elm.scale.x, 2);
    is('o', elm.alpha, 2);

  });

  withVnode('can create elements with sprite', vnode0 => {
    elm = patch(vnode0, h('container', [
      h('sprite')
    ])).elm;

    is('tag', elm.children[0].tag, 'sprite');
  });

  withVnode('patching an element', vnode0 => {
    let vnode1 = h('sprite', { x: 10, y: 10 }),
        vnode2 = h('sprite', { x: 10, y: 11 });

    patch(vnode0, vnode1);
    elm = patch(vnode1, vnode2).elm;

    is('y', elm.y, 11);
  });


  function spriteNum(n) {
    return h('sprite', { texture: n });
  }

  log('addition of elements');

  withVnode('appends elements', vnode0 => {
    var vnode1 = h('container', [1].map(spriteNum));
    var vnode2 = h('container', [1,2,3].map(spriteNum));
    elm = patch(vnode0, vnode1).elm;
    is('one', elm.children.length, 1);
    elm = patch(vnode1, vnode2).elm;
    is('three', elm.children.length, 3);
    is('x 1', elm.children[1].texture, 2);
    is('x 2', elm.children[2].texture, 3);
  });

  withVnode('prepends elements', vnode0 => {
    var vnode1 = h('container', [4, 5].map(spriteNum));
    var vnode2 = h('container', [1,2,3,4,5].map(spriteNum));
    elm = patch(vnode0, vnode1).elm;
    is('two', elm.children.length, 2);
    elm = patch(vnode1, vnode2).elm;

    deep_is('many', elm.children.map(texture), [1,2,3,4,5]);
  });
  
  withVnode('add elements in the middle', vnode0 => {
    var vnode1 = h('container', [1, 2, 4, 5].map(spriteNum));
    var vnode2 = h('container', [1,2,3,4,5].map(spriteNum));
    elm = patch(vnode0, vnode1).elm;
    is('four', elm.children.length, 4);
    elm = patch(vnode1, vnode2).elm;
    deep_is('many', elm.children.map(texture), [1,2,3,4,5]);
  });
  withVnode('add elements at begin and end', vnode0 => {
    var vnode1 = h('container', [2, 3, 4].map(spriteNum));
    var vnode2 = h('container', [1,2,3,4,5].map(spriteNum));
    elm = patch(vnode0, vnode1).elm;
    is('four', elm.children.length, 3);
    elm = patch(vnode1, vnode2).elm;
    deep_is('many', elm.children.map(texture), [1,2,3,4,5]);
  });

}

function withVnode(msg, f) {
  log(msg);
  let vnode0 = makeContainer();
  f(vnode0);
}
