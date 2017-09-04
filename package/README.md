# Richer



[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

## What is it?
This library is built on top of [slater](https://github.com/the-couch/slater) (which is a fork of shopify [slate](https://github.com/Shopify/slate)). It is based on the old implementation of the [Timber](https://github.com/Shopify/Timber) depreciated richcart. The idea behind this comes from Slate and Timber both being tied to jQuery and wanting to build something that could be used independent of that.

<img src="https://raw.githubusercontent.com/the-couch/richer/master/richer.gif" style="width: 620px; margin: 2em 0;"/>

## Using It
We use richer to handle API requests to the shopify AJAX cart. How you implement it is entirely up to you. We expose a couple of common routes that allow you to easily handle updating/refreshing/generating your ajax cart.

I'll outline a number of examples in YOYO below


### Initialize a cart
```javascript
import RicherAPI from 'richer'

// Some DOM defaults
const defaults = {
  addToCart: '.js-add-to-cart', // classname
  addToCartForm: 'AddToCartForm', // id
  cartContainer: 'CartContainer', // id
  cartCounter: 'CartCounter', // id
  items: []
}

const config = Object.assign({}, defaults, options)

const dom = {
  addToCartForm: document.getElementById(config.addToCartForm),
  cartContainer: document.getElementById(config.cartContainer),
  cartCounter: document.getElementById(config.cartCounter)
}

RicherAPI.getCart(cartUpdateCallback)

// Updates a cart number and builds our cart
const cartUpdateCallback = (cart) => {
  updateCount(cart)
  buildCart(cart)
}

const updateCount = (cart) => {
  const counter = dom.cartCounter
  counter.innerHTML = cart.item_count
}

const buildCart = (cart) => {
  const cartContainer = dom.cartContainer
  cartContainer.innerHTML = null

  if (cart.item_count === 0) {
    cartContainer.innerHTML = `<p>We're sorry your cart is empty</p>`
    return
  }

  var el = cartBlock(cart.items, cart, update)

  function cartBlock (items, cart, qtyControl) {
    return yo`
      <div class='r-cart'>
        ${items.map((item, index) => {
          const product = cleanProduct(item, index, config)
          return yo`
            <div class="r-cart__product f jcb">
              <div>
                <img src='${product.image}' alt='${product.name}' />
              </div>
              <div class="r-cart__product_info">
                <h5><a href='${product.url}'>${product.name}</a></h5>
                ${product.variation ? yo`<span>${product.variation}</span>` : null}
                ${realPrice(product.discountsApplied, product.originalLinePrice, product.linePrice)}
                ${yo`
                  <div class="r-cart__qty f jcb">
                    <div class="r-cart__qty_control" onclick=${() => qtyControl(product, product.itemMinus)}>
                      <svg width="20" height="20" viewBox="0 0 20 20"><path fill="#444" d="M17.543 11.029H2.1A1.032 1.032 0 0 1 1.071 10c0-.566.463-1.029 1.029-1.029h15.443c.566 0 1.029.463 1.029 1.029 0 .566-.463 1.029-1.029 1.029z"/></svg>
                    </div>
                    <span>${product.itemQty}</span>
                    <div class="r-cart__qty_control" onclick=${() => qtyControl(product, product.itemAdd)}>
                      <svg width="20" height="20" viewBox="0 0 20 20" class="icon"><path fill="#444" d="M17.409 8.929h-6.695V2.258c0-.566-.506-1.029-1.071-1.029s-1.071.463-1.071 1.029v6.671H1.967C1.401 8.929.938 9.435.938 10s.463 1.071 1.029 1.071h6.605V17.7c0 .566.506 1.029 1.071 1.029s1.071-.463 1.071-1.029v-6.629h6.695c.566 0 1.029-.506 1.029-1.071s-.463-1.071-1.029-1.071z"/></svg>
                    </div>
                  </div>
                `}
              </div>
            </div>
          `
        })}
        ${subTotal(cart.total_price, cart.total_cart_discount)}
      </div>
    `
  }

  function subTotal (total, discount) {
    // TODO: handling discounts
    const totalPrice = slate.Currency.formatMoney(total)  // eslint-disable-line
    return yo`
      <div>
        <h5>Subtotal: ${totalPrice}</h5>
      </div>
    `
  }

  function realPrice (discountsApplied, originalLinePrice, linePrice) {
    if (discountsApplied) {
      return yo`
        <div>
          <small className='strike'>${originalLinePrice}</small>
          <br /><span>${linePrice}</span>
        </div>
      `
    } else {
      return yo`
        <span>${linePrice}</span>
      `
    }
  }

  function update (item, quantity) {
     RicherAPI.changeItem((item.index + 1), quantity, refreshCart)
  }

  function refreshCart (cart) {
    let newCart = cartBlock(cart.items, cart, update)
    yo.update(el, newCart)
  }

  cartContainer.appendChild(el)
}

```



```javascript
import RicherAPI from 'richer'

const dom = {
  addToCartForm: document.getElementById('AddToCartForm'),
}

const AddToCart = () => {
  const form = dom.addToCartForm

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    form.classList.remove('is-added')
    form.classList.add('is-adding')

    RicherAPI.addItemFromForm(e.target, itemAddedCallback, itemErrorCallback)
  })

  const itemAddedCallback = () => {
    RicherAPI.getCart(cartUpdateCallback)
  }

  const itemErrorCallback = (XMLHttpRequest, textStatus) => {
    console.log('error family')
  }
}

const cartUpdateCallback = (cart) => {
  updateCount(cart)
  buildCart(cart)
  RicherAPI.onCartUpdate(cart)
}
```



MIT License
