// js/carrito.js

// Importar funciones de utilidad del carrito
import { getCartItems, saveCartItems } from './cartUtils.js';

document.addEventListener("DOMContentLoaded", () => {
    const listaProductosCarrito = document.getElementById('lista-productos-carrito');
    const subtotalElement = document.getElementById('subtotal-carrito');
    const envioElement = document.getElementById('envio-carrito');
    const totalElement = document.getElementById('total-carrito');
    const botonCheckout = document.getElementById('boton-checkout');
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    const carritoVacioMensaje = document.querySelector('.carrito-vacio-mensaje');

    const COSTO_ENVIO = 5.00; // Costo de envío fijo

    // Función para renderizar/actualizar los productos en la interfaz del carrito
    function renderCart() {
        let cart = getCartItems();
        listaProductosCarrito.innerHTML = ''; // Limpiar la lista actual

        if (cart.length === 0) {
            carritoVacioMensaje.style.display = 'block';
            botonCheckout.disabled = true;
            vaciarCarritoBtn.disabled = true;
        } else {
            carritoVacioMensaje.style.display = 'none';
            botonCheckout.disabled = false;
            vaciarCarritoBtn.disabled = false;
            
            cart.forEach(item => {
                const article = document.createElement('article');
                article.classList.add('item-carrito');
                article.dataset.productId = item.id; // Guarda el ID del producto
                
                const productName = item.name || item.nombre || 'Producto Desconocido';
                const productPrice = parseFloat(item.price || item.precio || 0).toFixed(2);
                const productImage = (item.images && item.images[0]) || item.imagen || 'ruta/a/imagen/por/defecto.jpg';
                
                // Obtener talla y color seleccionados (si existen)
                const selectedSize = item.selectedSize ? `<p class="item-opcion">Talla: ${item.selectedSize}</p>` : '';
                const selectedColor = item.selectedColor ? `<p class="item-opcion">Color: ${item.selectedColor}</p>` : '';


                article.innerHTML = `
                    <img src="${productImage}" alt="${productName}">
                    <div class="info-item">
                        <h3>${productName}</h3>
                        ${selectedSize}  ${selectedColor} <p class="precio-item">${productPrice}€</p>
                        <div class="cantidad-selector">
                            <button class="restar-cantidad" data-id="${item.id}" data-size="${item.selectedSize || ''}" data-color="${item.selectedColor || ''}">-</button>
                            <span class="cantidad-item">${item.quantity}</span>
                            <button class="sumar-cantidad" data-id="${item.id}" data-size="${item.selectedSize || ''}" data-color="${item.selectedColor || ''}">+</button>
                        </div>
                        <button class="eliminar-item" data-id="${item.id}" data-size="${item.selectedSize || ''}" data-color="${item.selectedColor || ''}">Eliminar</button>
                    </div>
                `;
                listaProductosCarrito.appendChild(article);
            });
        }
        calculateTotals(); // Recalcular totales cada vez que se renderiza el carrito
    }

    // Función para calcular y mostrar los totales
    function calculateTotals() {
        let cart = getCartItems();
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += parseFloat(item.price || item.precio || 0) * item.quantity;
        });

        const total = subtotal + COSTO_ENVIO; // <-- ¡Aquí estaba el error! Era COSTO_ENVio antes.

        subtotalElement.textContent = `${subtotal.toFixed(2)}€`;
        envioElement.textContent = `${COSTO_ENVIO.toFixed(2)}€`;
        totalElement.textContent = `${total.toFixed(2)}€`;

        if (cart.length === 0) {
            botonCheckout.disabled = true;
            vaciarCarritoBtn.disabled = true;
        } else {
            botonCheckout.disabled = false;
            vaciarCarritoBtn.disabled = false;
        }
    }

    // Función para actualizar la cantidad de un producto (ahora considera talla y color)
    function updateQuantity(productId, selectedSize, selectedColor, change) {
        let cart = getCartItems();
        // Encuentra el ítem exacto por ID, talla y color
        const itemIndex = cart.findIndex(item => 
            item.id == productId && 
            (item.selectedSize === selectedSize) && 
            (item.selectedColor === selectedColor)
        );

        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            saveCartItems(cart); // Guarda y vuelve a renderizar
        }
    }

    // Función para eliminar un producto del carrito (ahora considera talla y color)
    function removeItem(productId, selectedSize, selectedColor) {
        let cart = getCartItems();
        const initialLength = cart.length;
        // Filtra el ítem exacto por ID, talla y color
        cart = cart.filter(item => 
            !(item.id == productId && 
              (item.selectedSize === selectedSize) && 
              (item.selectedColor === selectedColor))
        );
        if (cart.length < initialLength) {
            saveCartItems(cart); // Guarda y vuelve a renderizar si algo se eliminó
        }
    }

    // Event Listeners para los botones de cantidad y eliminar (ahora pasan talla y color)
    listaProductosCarrito.addEventListener('click', (event) => {
        const target = event.target;
        const productId = target.dataset.id; 
        const selectedSize = target.dataset.size || ''; // Obtener la talla del dataset
        const selectedColor = target.dataset.color || ''; // Obtener el color del dataset

        if (target.classList.contains('sumar-cantidad')) {
            updateQuantity(productId, selectedSize, selectedColor, 1);
        } else if (target.classList.contains('restar-cantidad')) {
            updateQuantity(productId, selectedSize, selectedColor, -1);
        } else if (target.classList.contains('eliminar-item')) {
            removeItem(productId, selectedSize, selectedColor);
        }
    });

    // Event Listener para vaciar todo el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
            saveCartItems([]); // Guarda un array vacío
        }
    });

    // Función principal para actualizar toda la pantalla del carrito
    function updateCartDisplay() {
        renderCart();
        calculateTotals();
    }

    // Inicializar el carrito al cargar la página
    updateCartDisplay();
});