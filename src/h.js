import { vnode } from './vnode';
import * as is from './is';

export function h(sel, b, c) {
  let data = {}, children, i;
  if (c !== undefined) {
    data = b;
    if (is.array(c)) { children = c; }
    else if (c && c.sel) { children = [c]; }
  } else if (b !== undefined) {
    if (is.array(b)){ children = b; }
    else if (b && b.sel) { children = [b]; }
    else { data = b; }
  }

  return vnode(sel, data, children, undefined);
}
