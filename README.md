# snabbpixi
A Virtual DOM library for Pixi.js

It only supports `PIXI.Container` and `PIXI.Sprite` but you can extend it to work for custom display containers.

See example project at https://github.com/eguneys/tetris

## Example

```javascript
import * as PIXI from 'pixi.js';
import { init } from 'snabbpixi';

import { h } from 'snabbpixi';

const app = new PIXI.Application({});

app.loader
  .add("")
  .load(() => {

    let patch, vnode;

    function redraw() {
      vnode = patch(vnode, view());
    }

    patch = init([]);

    const blueprint = view();
    vnode = patch(app.stage, blueprint);
  };

function view() {
  return h('container', [
    h('sprite', {
     texture: PIXI.Texture.from('image.png')
    }),
    h('sprite', {
      texture: PIXI.Texture.from('image.png')
      x: 10,
      y: 10,
      height: 100,
      width: 100
    });
  ]);
}
```

## Tagnames

`container` for `PIXI.Container`
    
`sprite` for `PIXI.Sprite`

## Properties

All elements support `x, y, width, height, scale` properties.
Provide `texture` property for `sprite` tag.
