let cart = JSON.parse(localStorage.getItem('cart')) || []

function updateCartUI() {
  const cartCount = document.querySelector('.title-cart h2');
  cartCount.textContent = `Your cart (${cart.length})`;

  const cartContainer = document.querySelector('.img-empty-cart');
  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    const img = document.createElement('img');
    img.src = './assets/images/illustration-empty-cart.svg';
    img.alt = 'cart empty';
    cartContainer.appendChild(img);
    const msg = document.createElement('p');
    msg.classList.add('msg');
    msg.innerHTML = 'Your added items will appear here';
    cartContainer.appendChild(msg);
  } else {
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <p class='cart-item-name'>${item.name}</p>
        <p class='cart-item-quantity'>${item.quantity}x</p>
        <p class='cart-item-price'>@$${item.price.toFixed(2)}</p>
        <p class='cart-item-total'>$${(item.price * item.quantity).toFixed(2)}</p>
        <svg class='cart-item-remove' xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="red" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
      `;
      cartContainer.appendChild(cartItem);

      cartItem.querySelector('.cart-item-remove').addEventListener('click', () => {
        removeFromCart(item);
      })
    });

    // Update order total
    const orderTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const orderTotalDiv = document.createElement('div');
    orderTotalDiv.classList.add('order-total');

    const orderTotalH3 = document.createElement('p');
    orderTotalH3.classList.add('order-total-h3')
    orderTotalH3.textContent = 'Order Total:';

    const orderTotalPrice = document.createElement('span');
    orderTotalPrice.classList.add('order-total-price');
    orderTotalPrice.textContent = `$${orderTotal.toFixed(2)}`;

    orderTotalDiv.appendChild(orderTotalH3);
    orderTotalDiv.appendChild(orderTotalPrice);
    cartContainer.appendChild(orderTotalDiv);

    const detailsContainer = document.createElement('div')
    detailsContainer.classList.add('details-container')

    const detailsImg = document.createElement('div')
    detailsImg.classList.add('details-img')

    const detailsText = document.createElement('p')
    detailsText.classList.add('details-text')
    detailsText.innerHTML = `This is a <strong>carbon-neutral</strong> delivery`

    detailsContainer.appendChild(detailsImg)
    detailsContainer.appendChild(detailsText)
    cartContainer.appendChild(detailsContainer)

    const btnContainer = document.createElement('div')
    btnContainer.classList.add('btn-container')

    const btn = document.createElement('button')
    btn.classList.add('btn')
    btn.textContent = 'Confirm Order'

    btn.addEventListener('click', () => {
      showPopup()
    })

    btnContainer.appendChild(btn)
    cartContainer.appendChild(btnContainer)
  }
}

function addToCart(product) {
  const existingProduct = cart.find(item => item.name === product.name);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();

  // Adicionar classe ao botão e à imagem do produto selecionado
  const productElements = document.querySelectorAll('.product');
  productElements.forEach(element => {
    const productName = element.querySelector('h2').textContent;
    if (productName === product.name) {
      const button = element.querySelector('button');
      button.classList.add('selected');
      element.querySelector('img').classList.add('selected');

      // Adicionar elementos de controle de quantidade
      button.innerHTML = `
        <svg class="decrease-quantity" xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>
        <span class="quantity">${existingProduct ? existingProduct.quantity : 1}</span>
        <svg class="increase-quantity" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
      `;

      button.querySelector('.decrease-quantity').addEventListener('click', (e) => {
        e.stopPropagation();
        decreaseQuantity(product);
      });

      button.querySelector('.increase-quantity').addEventListener('click', (e) => {
        e.stopPropagation();
        increaseQuantity(product);
      });
    }
  });
}

function removeFromCart(product) {
  const existingProduct = cart.find(item => item.name === product.name);
  if (existingProduct.quantity > 1) {
    existingProduct.quantity -= 1;
  } else {
    cart = cart.filter(item => item.name !== product.name);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();

  // Remover classe do botão e da imagem do produto quando não estiver mais no carrinho
  const productElements = document.querySelectorAll('.product');
  productElements.forEach(element => {
    const productName = element.querySelector('h2').textContent;
    if (productName === product.name && !cart.find(item => item.name === product.name)) {
      const button = element.querySelector('button');
      button.classList.remove('selected');
      element.querySelector('img').classList.remove('selected');
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20">
          <g fill="#C73B0F" clip-path="url(#a)">
            <path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"/>
            <path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"/>
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M.333 0h20v20h-20z"/>
            </clipPath>
          </defs>
        </svg>
        <span>Add to Cart</span>
      `;
    }
  });
}

function increaseQuantity(product) {
  const existingProduct = cart.find(item => item.name === product.name);
  if (existingProduct) {
    existingProduct.quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    updateProductButton(product);
  }
}

function decreaseQuantity(product) {
  const existingProduct = cart.find(item => item.name === product.name);
  if (existingProduct && existingProduct.quantity > 1) {
    existingProduct.quantity -= 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    updateProductButton(product);
  } else {
    removeFromCart(product);
  }
}

function updateProductButton(product) {
  const productElements = document.querySelectorAll('.product');
  productElements.forEach(element => {
    const productName = element.querySelector('h2').textContent;
    if (productName === product.name) {
      const button = element.querySelector('button');
      const existingProduct = cart.find(item => item.name === product.name);
      button.querySelector('.quantity').textContent = existingProduct ? existingProduct.quantity : 0;
    }
  });
}

function resetProductButtons() {
  const productElements = document.querySelectorAll('.product');
  productElements.forEach(element => {
    const button = element.querySelector('button');
    button.classList.remove('selected');
    element.querySelector('img').classList.remove('selected');
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20">
        <g fill="#C73B0F" clip-path="url(#a)">
          <path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"/>
          <path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"/>
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M.333 0h20v20h-20z"/>
          </clipPath>
        </defs>
      </svg>
      <span>Add to Cart</span>
    `;
  });
}



function showPopup() {
  const popup = document.querySelector('.pop-up');
  const productsConfirmationDetails = document.querySelector('.products-confirmation-details');
  const orderTotalConfirmation = document.querySelector('.order-total-confirmation');

  productsConfirmationDetails.innerHTML = '';
  orderTotalConfirmation.innerHTML = '';

  cart.forEach(item => {
    const productDetail = document.createElement('div');
    productDetail.classList.add('product-detail');
    productDetail.innerHTML = `
      <img src="${item.image.thumbnail}" alt="${item.name}">
      <p>${item.name} (${item.quantity}x) - $${(item.price * item.quantity).toFixed(2)}</p>
    `;
    productsConfirmationDetails.appendChild(productDetail);
  });

  // Add order total to the popup
  const orderTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const orderTotalText = document.createElement('p')
  orderTotalText.classList.add('order-total-text');
  orderTotalText.textContent = `Order Total: `;

  const orderTotalPrice = document.createElement('p')
  orderTotalPrice.classList.add('order-total-price');
  orderTotalPrice.textContent = `$${orderTotal.toFixed(2)}`;

  orderTotalConfirmation.appendChild(orderTotalText)
  orderTotalConfirmation.appendChild(orderTotalPrice)

  // Show the popup
  popup.style.visibility = 'visible';
  popup.style.opacity = '1';

  const overlay = document.querySelector('.overlay');
  overlay.style.visibility = 'visible';
  overlay.style.opacity = '1';
}

function hidePopup() {
  if (confirm('Are you sure you want to confirm the order?')) {
    const popup = document.querySelector('.pop-up');
    popup.style.opacity = '0';
    popup.addEventListener('transitionend', () => {
      popup.style.visibility = 'hidden';
    }, { once: true });

    const overlay = document.querySelector('.overlay');
    overlay.style.opacity = '0';
    overlay.addEventListener('transitionend', () => {
      overlay.style.visibility = 'hidden';
    }, { once: true });

    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    resetProductButtons();
  }
}

function closePopup() {
  const popup = document.querySelector('.pop-up');
  popup.style.opacity = '0';
  popup.addEventListener('transitionend', () => {
    popup.style.visibility = 'hidden';
  }, { once: true });

  const overlay = document.querySelector('.overlay');
  overlay.style.opacity = '0';
  overlay.addEventListener('transitionend', () => {
    overlay.style.visibility = 'hidden';
  }, { once: true });
}
// load json data
document.addEventListener('DOMContentLoaded', () => {
  fetch('./data.json')
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
      }
      return res.json()
    })
    .then((data) => {
      const productsContainer = document.querySelector('.products')
      data.forEach((product) => {
        // create a product element
        const productElement = document.createElement('div')
        productElement.classList.add('product')

        //create and append the image element of product
        const img = document.createElement('img')
        img.src = product.image.thumbnail
        img.alt = product.name
        productElement.appendChild(img)

        // create and append the button 
        const button = document.createElement('button')
        button.classList.add('add-to-cart')
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20">
            <g fill="#C73B0F" clip-path="url(#a)">
              <path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"/>
              <path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"/>
            </g>
            <defs>
              <clipPath id="a">
                <path fill="#fff" d="M.333 0h20v20h-20z"/>
              </clipPath>
            </defs>
          </svg>
          <span>Add to Cart</span>`
        productElement.appendChild(button)

        // add event listener to the button
        button.addEventListener('click', () => addToCart(product))

        //create and append the category of the product
        const category = document.createElement('p')
        category.textContent = product.category
        productElement.appendChild(category)

        //create and append the name of the product
        const name = document.createElement('h2')
        name.textContent = product.name
        productElement.appendChild(name)

        //create and append the price of the product
        const price = document.createElement('p')
        price.classList.add('price')
        price.textContent = `$${product.price.toFixed(2)}`
        productElement.appendChild(price)

        // append the product element to the products container
        productsContainer.appendChild(productElement)
      });
    })
    .catch((error) =>
      console.error("Unable to fetch data: ", error))

  updateCartUI()
})


// load img empty cart
window.addEventListener('DOMContentLoaded', () => {
  
  updateCartUI()
})