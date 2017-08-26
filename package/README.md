# Richer



[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

## What is it?
This library is built on top of [slater](https://github.com/the-couch/slater) (which is a fork of shopify [slate](https://github.com/Shopify/slate)). It is based on the old implementation of the [Timber](https://github.com/Shopify/Timber) depreciated richcart. The idea behind this comes from Slate and Timber both being tied to jQuery and wanting to build something that could be used independent of that.


```javascript
import { richer } from 'richer'

let cartOptions = {
  cartContainer: 'CartContainer', // Accepts an ID
  addToCartFrom: 'AddToCartFrom', // Accepts an ID
  cartCounter: 'CartCounter', // Accepts an ID
}
let richCart = new Richer(cartOptions)
richer.init()
```

## Todo
- [ ] handle money formatting outside of slate
- [ ] ability to use other templating languages (react, preact, vue)



MIT License
