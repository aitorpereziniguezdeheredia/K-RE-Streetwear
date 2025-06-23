/**
 * Obtiene los ítems del carrito desde localStorage.
 * @returns {Array} Un array de objetos de producto en el carrito.
 */
export function getCartItems() {
  const cartItemsString = localStorage.getItem('cartItems');
  return cartItemsString ? JSON.parse(cartItemsString) : [];
}

/**
 * Guarda los ítems del carrito en localStorage.
 * @param {Array} items - El array de objetos de producto a guardar.
 */
export function saveCartItems(items) {
  localStorage.setItem('cartItems', JSON.stringify(items));
}

/**
 * Añade un producto al carrito o incrementa su cantidad si ya existe.
 * Considera talla y color para identificar ítems únicos.
 * @param {Object} product - El objeto del producto a añadir (debe tener id, name/nombre, price/precio, images/imagen, quantity, selectedSize, selectedColor).
 */
export function addToCart(product) {
  let cart = getCartItems();

  // Aseguramos que talla y color existan, incluso si están vacíos
  const itemSelectedSize = product.selectedSize || '';
  const itemSelectedColor = product.selectedColor || '';

  // IMPORTANTE: Ahora buscamos un ítem existente por ID, TALLA y COLOR
  const existingItemIndex = cart.findIndex(item =>
    item.id == product.id &&
    item.selectedSize === itemSelectedSize && // Compara también la talla
    item.selectedColor === itemSelectedColor  // Compara también el color
  );

  const quantityToAdd = (product.quantity && typeof product.quantity === 'number' && product.quantity > 0) ? product.quantity : 1;

  if (existingItemIndex > -1) {
    // Si el producto EXACTO (misma ID, talla y color) ya existe, incrementa su cantidad
    cart[existingItemIndex].quantity += quantityToAdd;
  } else {
    // Si es una nueva variación del producto (o un producto completamente nuevo), añádelo como una nueva entrada
    cart.push({
        id: product.id,
        name: product.name || product.nombre,
        price: product.price || product.precio,
        images: product.images || (product.imagen ? [product.imagen] : []),
        quantity: quantityToAdd,
        selectedSize: itemSelectedSize,   // Guarda la talla
        selectedColor: itemSelectedColor  // Guarda el color
    });
  }
  saveCartItems(cart); // Guarda el carrito actualizado en localStorage

  // Notificación al usuario con la talla y el color
  const optionsText = `${itemSelectedSize ? 'Talla: ' + itemSelectedSize : ''}${itemSelectedSize && itemSelectedColor ? ', ' : ''}${itemSelectedColor ? 'Color: ' + itemSelectedColor : ''}`;
  alert(`"${product.name || product.nombre}" ${optionsText ? '(' + optionsText + ')' : ''} añadido al carrito (x${quantityToAdd}).`);
}