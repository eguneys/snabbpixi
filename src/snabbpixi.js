import vnode from './vnode';
import pixiApi from './pixiapi';

import * as is from './is';

export {h} from './h';

function isUndef(s) { return s === undefined; }
function isDef(s) { return s !== undefined; }

function sameVnode(vnode1, vnode2) {
  return vnode1.sel === vnode2.sel &&
    vnode1.texture === vnode2.texture;
}

function isVnode(vnode) {
  return vnode.sel !== undefined;
}

export function init(modules, pApi) {
  const api = pApi !== undefined? pApi : pixiApi;

  function emptyNodeAt(app) {
    return vnode('app', {}, [], app);
  }

  function createRmCb(childElm) {
    return function rmCb() {
      const parent = api.parentNode(childElm);
      api.removeChild(parent, childElm);
    };
  }

  function createElm(vnode) {
    let i;
    let children = vnode.children,
        sel = vnode.sel,
        texture = vnode.texture,
        data = vnode.data;

    const tag = sel;
    const elm = vnode.elm = api.createElement(tag, texture, data);

    api.setDataContent(elm, data);

    if (is.array(children)) {
      for (i = 0; i < children.length; ++i) {
        const ch = children[i];
        if (ch !== null) {
          api.addChild(elm, createElm(ch));
        }
      }
    }

    return vnode.elm;
  }

  function addVnodes(parentElm,
                     before,
                     vnodes,
                     startIdx,
                     endIdx) {
    for (;startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx];
      if (ch !== null) {
        api.addChildBefore(parentElm, createElm(ch), before);
      }
    }
  }

  function removeVnodes(parentElm,
                        vnodes,
                        startIdx,
                        endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      let i, rm, ch = vnodes[startIdx];
      if (ch !== null) {
        if (isDef(ch.sel)) {
          rm = createRmCb(ch.elm);
          rm();
        }
      }
    }
  }

  function updateChildren(parentElm,
                          oldCh,
                          newCh) {
    let oldStartIdx = 0, newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let before;


    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (oldStartVnode == null) {
        oldStartVnode = oldCh[++oldStartIdx];
      } else if (oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx];
      } else if (newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];        
      } else {
        api.addChildBefore(parentElm, createElm(newStartVnode), oldStartVnode.elm);
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
      if (oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? undefined : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx);
      } else {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }
  }

  function patchVnode(oldVnode, vnode) {
    const elm = vnode.elm = oldVnode.elm;
    let oldCh = oldVnode.children;
    let ch = vnode.children;
    if (oldVnode === vnode) return;

    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) updateChildren(elm, oldCh, ch);
    } else if (isDef(ch)) {
      addVnodes(elm, ch);
    } else if (isDef(oldCh)) {
      removeVnodes(elm, oldCh);
    } else {
    }
    api.setDataContent(elm, vnode.data);
  }
  
  return function patch(oldVnode, vnode) {
    let elm;
    
    if (!isVnode(oldVnode)) {
      oldVnode = emptyNodeAt(oldVnode);
    }

    if (sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode);
    } else {
      elm = oldVnode.elm;
      createElm(vnode);

      api.addChild(elm, vnode.elm);
    }

    return vnode;
  };
};
