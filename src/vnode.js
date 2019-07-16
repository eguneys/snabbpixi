export function vnode(sel, data, children, elm) {
  const { texture } = data;
  return { sel, texture, data, children, elm };
}

export default vnode;
