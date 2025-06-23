// js/detalles.js

// Importar la función addToCart desde cartUtils.js
import { addToCart } from './cartUtils.js';

let currentProduct = null; // Variable para almacenar el producto que se está visualizando

/**
 * Carga y muestra los detalles de un producto basándose en el ID de la URL.
 */
async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); // Obtener el ID del producto de la URL (e.g., ?id=1)

    // Referencias a los elementos HTML donde se mostrarán los detalles
    const productTitlePage = document.getElementById('detalle-titulo-pagina');
    const mainImage = document.getElementById('detalle-imagen-principal');
    const thumbnailsContainer = document.getElementById('detalle-miniaturas');
    const productNameElement = document.getElementById('detalle-nombre');
    const productDescriptionElement = document.getElementById('detalle-descripcion');
    const productPriceElement = document.getElementById('detalle-precio');
    const productSizeSelect = document.getElementById('detalle-talla');
    const productColorSelect = document.getElementById('detalle-color');
    const productQuantityInput = document.getElementById('detalle-cantidad');
    const addToCartButton = document.getElementById('boton-anadir-carrito');
    const backButton = document.querySelector('.back-button'); // El botón de volver en el header

    // Limpiar campos iniciales en caso de recarga o errores
    productNameElement.textContent = 'Producto no encontrado';
    productDescriptionElement.textContent = '';
    productPriceElement.textContent = '0.00';
    mainImage.src = '';
    thumbnailsContainer.innerHTML = '';
    productSizeSelect.innerHTML = '<option value="">Selecciona una talla</option>';
    productColorSelect.innerHTML = '<option value="">Selecciona un color</option>';
    productQuantityInput.value = 1;
    if (addToCartButton) addToCartButton.disabled = true; // Deshabilitar hasta cargar producto

    if (!productId) {
        console.error("No se encontró el ID del producto en la URL.");
        // Mostrar un mensaje de error en la página
        if (productNameElement) productNameElement.textContent = 'Error: ID de producto no encontrado.';
        if (productDescriptionElement) productDescriptionElement.textContent = 'Por favor, regresa a la tienda para seleccionar un producto.';
        return;
    }

    try {
        const response = await fetch('../API/clothes.json'); // Cargar todos los productos
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allProducts = await response.json();
        
        // Encontrar el producto específico por su ID (usar == para comparar string/number)
        currentProduct = allProducts.find(p => p.id == productId);

        if (currentProduct) {
            // Actualizar el título de la página
            if (productTitlePage) productTitlePage.textContent = `${currentProduct.name} - KÖRE Streetwear`;

            // Rellenar la información del producto
            if (productNameElement) productNameElement.textContent = currentProduct.name;
            if (productDescriptionElement) productDescriptionElement.textContent = currentProduct.description;
            if (productPriceElement) productPriceElement.textContent = parseFloat(currentProduct.price).toFixed(2);
            
            // Configurar la imagen principal
            if (mainImage && currentProduct.images && currentProduct.images.length > 0) {
                mainImage.src = currentProduct.images[0];
                mainImage.alt = currentProduct.name;
            }

            // Crear miniaturas (si existen más imágenes)
            if (thumbnailsContainer && currentProduct.images && currentProduct.images.length > 1) {
                currentProduct.images.forEach(imgSrc => {
                    const thumbImg = document.createElement('img');
                    thumbImg.src = imgSrc;
                    thumbImg.alt = `${currentProduct.name} miniatura`;
                    thumbImg.classList.add('miniatura-imagen');
                    thumbImg.addEventListener('click', () => {
                        mainImage.src = imgSrc; // Cambiar la imagen principal al hacer clic en miniatura
                    });
                    thumbnailsContainer.appendChild(thumbImg);
                });
            }

            // Rellenar opciones de talla
            if (productSizeSelect && currentProduct.sizes) {
                // Si solo hay una talla, seleccionarla por defecto
                if (currentProduct.sizes.length === 1) {
                    const option = document.createElement('option');
                    option.value = currentProduct.sizes[0];
                    option.textContent = currentProduct.sizes[0];
                    option.selected = true; // Seleccionada por defecto
                    productSizeSelect.innerHTML = ''; // Limpiar antes de añadir
                    productSizeSelect.appendChild(option);
                    productSizeSelect.disabled = true; // Deshabilitar si solo hay una
                } else {
                    productSizeSelect.innerHTML = '<option value="">Selecciona una talla</option>'; // Reset
                    currentProduct.sizes.forEach(size => {
                        const option = document.createElement('option');
                        option.value = size;
                        option.textContent = size;
                        productSizeSelect.appendChild(option);
                    });
                    productSizeSelect.disabled = false;
                }
            }

            // Rellenar opciones de color
            if (productColorSelect && currentProduct.colors) {
                 // Si solo hay un color, seleccionarlo por defecto
                 if (currentProduct.colors.length === 1) {
                    const option = document.createElement('option');
                    option.value = currentProduct.colors[0];
                    option.textContent = currentProduct.colors[0];
                    option.selected = true; // Seleccionada por defecto
                    productColorSelect.innerHTML = ''; // Limpiar antes de añadir
                    productColorSelect.appendChild(option);
                    productColorSelect.disabled = true; // Deshabilitar si solo hay uno
                 } else {
                    productColorSelect.innerHTML = '<option value="">Selecciona un color</option>'; // Reset
                    currentProduct.colors.forEach(color => {
                        const option = document.createElement('option');
                        option.value = color;
                        option.textContent = color;
                        productColorSelect.appendChild(option);
                    });
                    productColorSelect.disabled = false;
                 }
            }

            // Habilitar el botón de añadir al carrito
            if (addToCartButton) {
                addToCartButton.disabled = false;
                // Adjuntar event listener al botón después de que se haya cargado el producto
                addToCartButton.addEventListener('click', () => {
                    const quantity = parseInt(productQuantityInput.value, 10);
                    const selectedSize = productSizeSelect ? productSizeSelect.value : '';
                    const selectedColor = productColorSelect ? productColorSelect.value : '';

                    // Validaciones
                    if (isNaN(quantity) || quantity < 1) {
                        alert('Por favor, selecciona una cantidad válida.');
                        return;
                    }
                    if (productSizeSelect && selectedSize === '') { // Solo validar si el select de talla existe y no tiene una talla única preseleccionada
                        alert('Por favor, selecciona una talla.');
                        return;
                    }
                    if (productColorSelect && selectedColor === '') { // Solo validar si el select de color existe y no tiene un color único preseleccionado
                        alert('Por favor, selecciona un color.');
                        return;
                    }
                    
                    // Crear un objeto de producto para añadir al carrito, incluyendo la cantidad, talla y color
                    const productToAddToCart = { 
                        ...currentProduct, 
                        quantity: quantity,
                        selectedSize: selectedSize,   // Añadimos la talla seleccionada
                        selectedColor: selectedColor // Añadimos el color seleccionado
                    };
                    
                    addToCart(productToAddToCart); // Añade el producto (con cantidad, talla y color) al carrito
                    window.location.href = 'tienda.html'; // Redirige de vuelta a la tienda
                });
            }

            // Event listener para el botón de volver (flecha)
            if (backButton) {
                backButton.addEventListener('click', (e) => {
                    e.preventDefault(); // Prevenir la navegación predeterminada del enlace
                    window.location.href = 'tienda.html'; // Redirige de vuelta a la tienda
                });
            }

        } else {
            if (productNameElement) productNameElement.textContent = 'Producto no encontrado.';
            if (productDescriptionElement) productDescriptionElement.textContent = 'El producto con el ID especificado no existe.';
            console.warn(`Producto con ID ${productId} no encontrado en clothes.json.`);
        }
    } catch (error) {
        console.error("Error al cargar los detalles del producto:", error);
        if (productNameElement) productNameElement.textContent = 'Error al cargar los detalles del producto.';
        if (productDescriptionElement) productDescriptionElement.textContent = 'Ha ocurrido un problema al intentar obtener la información del producto.';
    }
}

// Cargar los detalles del producto cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', loadProductDetails);