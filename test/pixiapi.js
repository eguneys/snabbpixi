import { testBrowser } from 'testiz';

const { log, ok, is, not } = testBrowser; 

import { init } from '../src/snabbpixi';
import { h } from '../src/snabbpixi';

import { testCreateElement, makeContainer } from './utils';

import { makePixiApi } from '../src/pixiapi';

const testPixiApi = makePixiApi(testCreateElement);

const patch = init([], testPixiApi);

export default function test() {

  
  
}

function testApi() {
  log('elements');

  let vnode0 = makeContainer();

  var a = h('container', {}, [
    h('g'),
    h('g')
  ]);

  var b = h('container', {}, [
    h('g')
  ]);

  var result = patch(patch(vnode0, a), b).elm;
  is('removes child elements', result.children.length, 1);
}
