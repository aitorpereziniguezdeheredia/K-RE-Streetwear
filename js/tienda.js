// js/tienda.js

// Importar funciones de utilidad del carrito
// Se mantienen los imports aunque addToCart ya no se use directamente aquí,
// por si se decidiera reintroducir una funcionalidad de "compra rápida" diferente,
// o si otras partes del script lo requirieran.
import { getCartItems, saveCartItems, addToCart } from './cartUtils.js';

// Variables globales
let productos = [];
let modoEliminarActivo = false;

// --- Función para renderizar la galería de productos ---
function renderizarGaleria() {
  const galeria = document.querySelector(".galeria-products");
  if (!galeria) {
    console.error("Elemento .galeria-products no encontrado. Asegúrate de que existe en tienda.html");
    return;
  }
  galeria.innerHTML = ""; // Limpiar la galería antes de renderizar

  productos.forEach((producto) => {
    const article = document.createElement("article");
    
    const productId = producto.id;
    const productName = producto.name || producto.nombre || 'Producto Desconocido';
    const productPrice = (producto.price || producto.precio || 0).toFixed(2);
    const productImageSrc = (producto.images && producto.images[0]) || producto.imagen || '';
    const productAlt = producto.alt || productName;

    article.innerHTML = `
      <img src="${productImageSrc}" alt="${productAlt}">
      <h3>${productName}</h3>
      <p>Precio: ${productPrice}€</p>
      <button data-product-id="${productId}" class="accion-boton">
        ${modoEliminarActivo ? "Eliminar" : "Comprar"}
      </button>
    `;

    const boton = article.querySelector(".accion-boton");
    if (modoEliminarActivo) {
      boton.classList.add("eliminar-modo");
      boton.addEventListener("click", () => {
        productos = productos.filter(p => p.id !== productId);
        renderizarGaleria();
      });
    } else {
      boton.classList.add("comprar-modo"); 
      boton.addEventListener("click", (event) => {
        const idToViewDetails = event.target.dataset.productId;
        // Redirige a la página de detalles cuando se hace clic en el botón "Comprar"
        window.location.href = `detalle_producto.html?id=${idToViewDetails}`;
      });
    }
    galeria.appendChild(article);
  });
}

// --- Funciones para el formulario de añadir productos ---
function mostrarAñadirProductos() {
  const formulario = document.getElementById("formulario-productos");
  if (formulario) {
    formulario.classList.remove("oculto");
  }
}

function activarModoEliminar() {
  modoEliminarActivo = !modoEliminarActivo;
  const botonModoEliminar = document.getElementById("modo-eliminar");
  if (botonModoEliminar) {
    botonModoEliminar.textContent = modoEliminarActivo ? "Desactivar Modo Eliminar" : "Activar Modo Eliminar";
  }
  renderizarGaleria();
}

function inicializarFormularioProducto() {
  const formulario = document.getElementById("anadir-producto-form");
  const nombreInput = document.getElementById("nombre-producto");
  const precioInput = document.getElementById("precio");
  const imagenInput = document.getElementById("imagen-producto");
  const imagenVista = document.getElementById("vista-imagen");
  const vistaNombre = document.getElementById("vista-nombre");
  const vistaPrecio = document.getElementById("vista-precio");
  const botonBorrar = document.getElementById("borrar-imagen");

  imagenInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagenVista.src = e.target.result;
        botonBorrar.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      imagenVista.src = "";
      botonBorrar.style.display = "none";
    }
  });

  botonBorrar.addEventListener("click", () => {
    imagenVista.src = "";
    imagenInput.value = "";
    botonBorrar.style.display = "none";
  });

  nombreInput.addEventListener("input", () => {
    vistaNombre.textContent = nombreInput.value.trim() || "Nombre del producto";
  });

  precioInput.addEventListener("input", () => {
    vistaPrecio.textContent = `${parseFloat(precioInput.value || 0).toFixed(2)}€`;
  });

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const precioTexto = precioInput.value.trim();
    const imagenSrc = imagenVista.src;

    if (!nombre || !precioTexto || !imagenSrc || imagenSrc === window.location.href) {
      alert("Por favor, rellena correctamente el formulario y añade una imagen.");
      return;
    }

    const precio = parseFloat(precioTexto);

    const nuevoProducto = {
      id: `manual-${Date.now()}`,
      name: nombre,
      price: precio,
      images: [imagenSrc],
      description: "Producto añadido manualmente.",
      category: "otros",
      sizes: ["Única"],
      colors: ["varios"],
      stock: 1,
      createdAt: new Date().toISOString(),
      isAvailable: true
    };

    productos.push(nuevoProducto);
    renderizarGaleria();

    formulario.reset();
    document.getElementById("vista-nombre").textContent = "Nombre del producto";
    document.getElementById("vista-precio").textContent = "0€";
    imagenVista.src = "";
    botonBorrar.style.display = "none";
  });
}

// --- Carga de productos desde clothes.json ---
async function loadProducts() {
    try {
        const response = await fetch('../API/clothes.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        productos = await response.json();
        renderizarGaleria();
    } catch (error) {
        console.error("Error al cargar los productos desde clothes.json:", error);
    }
}

// --- Event Listeners que se activan cuando el DOM está completamente cargado ---
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  inicializarFormularioProducto();

  const anadirProductosBtn = document.getElementById("anadir-productos");
  if (anadirProductosBtn) {
    anadirProductosBtn.addEventListener("click", mostrarAñadirProductos);
  } else {
    console.warn("Botón 'anadir-productos' no encontrado.");
  }

  const modoEliminarBtn = document.getElementById("modo-eliminar");
  if (modoEliminarBtn) {
    modoEliminarBtn.addEventListener("click", activarModoEliminar);
  } else {
    console.warn("Botón 'modo-eliminar' no encontrado.");
  }
  
  const cerrarFormularioBtn = document.getElementById("cerrar-formulario");
  if (cerrarFormularioBtn) {
    cerrarFormularioBtn.addEventListener("click", () => {
        const formulario = document.getElementById("formulario-productos");
        if (formulario) {
            formulario.classList.add("oculto");
        }
    });
  } else {
    console.warn("Botón 'cerrar-formulario' no encontrado.");
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const formulario = document.getElementById("formulario-productos");
      if (formulario && !formulario.classList.contains("oculto")) {
        formulario.classList.add("oculto");
      }
      
      if (modoEliminarActivo) {
        modoEliminarActivo = false;
        const botonModoEliminar = document.getElementById("modo-eliminar");
        if (botonModoEliminar) {
            botonModoEliminar.textContent = "Activar Modo Eliminar";
        }
        renderizarGaleria();
      }
    }
  });
});