// Handles all the things ajax cart related,
// based around the timber ajax cart, minus the jquery
import serialize from 'form-serialize'
import fetch from 'unfetch'

const RicherAPI = {}

// tacos
RicherAPI.onCartUpdate = (cart) => {
  console.log('items in the cart?', cart.item_count)
}

RicherAPI.addItemFromForm = (form, callback, errorCallback) => {
  form = serialize(form, {hash: true})
  fetch('/cart/add.js', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  })
    .then(r => {
      if ((typeof callback) === 'function') {
        callback(r.json())
      } else {
        RicherAPI.onCartUpdate(r.json())
      }
    })
}

RicherAPI.getCart = (callback) => {
  fetch('/cart.js', { credentials: 'same-origin' })
    .then(r => r.json())
    .then(cart => {
      if ((typeof callback) === 'function') {
        callback(cart)
      } else {
        RicherAPI.onCartUpdate(cart)
      }
    })
}

RicherAPI.changeItem = (line, quantity, callback) => {
  let data = { line: line, quantity: quantity }
  fetch('/cart/change.js', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(r => r.json())
    .then(cart => {
      callback(cart)
    })
}

export default RicherAPI
