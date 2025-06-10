const productos = [
  {
    nombre: "Camisa Blanca",
    precio: 25.0,
    imagen: "../assest/image/tienda/camisa_blanca.webp",
    alt: "Camisa blanca de algodón"
  },
  {
    nombre: "Pantalón Negro",
    precio: 40.0,
    imagen: "../assest/image/tienda/pantalon_negro.webp",
    alt: "Pantalón negro estilo urbano"
  },
  {
    nombre: "Chaqueta Jean",
    precio: 60.0,
    imagen: "../assest/image/tienda/chaqueta_jean.webp",
    alt: "Chaqueta vaquera moderna"
  }
];

let modoEliminarActivo = false;

function renderizarGaleria() {
  const galeria = document.querySelector(".galeria-products");
  galeria.innerHTML = "";

  productos.forEach((producto, index) => {
    const article = document.createElement("article");
    article.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.alt}">
      <h3>${producto.nombre}</h3>
      <p>Precio: ${producto.precio.toFixed(2)}€</p>
      <button>${modoEliminarActivo ? "Eliminar" : "Comprar"}</button>
    `;

    const boton = article.querySelector("button");
    if (modoEliminarActivo) {
      boton.classList.add("eliminar-producto");
      boton.onclick = () => {
        productos.splice(index, 1);
        renderizarGaleria();
        activarModoEliminar(); //  Reaplica el modo eliminar tras render
      };
    }

    galeria.appendChild(article);
  });
}

function mostrarAñadirProductos() {
  document.getElementById("formulario-productos").classList.toggle("oculto");
}

function activarModoEliminar() {
  modoEliminarActivo = !modoEliminarActivo;
  renderizarGaleria();

  const botonEliminar = document.getElementById("modo-eliminar");
  botonEliminar.textContent = modoEliminarActivo
    ? "Salir del modo eliminar"
    : "Eliminar";
}

function inicializarFormularioProducto() {
  const formulario = document.getElementById("formulario-producto");
  const imagenVista = document.getElementById("vista-imagen");
  const botonBorrar = document.getElementById("borrar-imagen");
  const inputArchivo = document.getElementById("archivo");

  formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const precio = parseFloat(document.getElementById("precio").value).toFixed(2);
    const archivo = inputArchivo.files[0];

    document.getElementById("vista-nombre").textContent = nombre;
    document.getElementById("vista-precio").textContent = `${precio} €`;

    if (archivo) {
      const lector = new FileReader();
      lector.onload = function (e) {
        imagenVista.src = e.target.result;
        botonBorrar.style.display = "block";
      };
      lector.readAsDataURL(archivo);
    }
  });

  botonBorrar.addEventListener("click", function () {
    imagenVista.src = "";
    botonBorrar.style.display = "none";
    inputArchivo.value = "";
  });

  const botonAgregar = document.querySelector(".boton-final");
  botonAgregar.addEventListener("click", () => {
    const nombre = document.getElementById("vista-nombre").textContent;
    const precioTexto = document.getElementById("vista-precio").textContent;
    const imagenSrc = document.getElementById("vista-imagen").src;

    if (!nombre || !precioTexto || !imagenSrc || imagenSrc === window.location.href) {
      alert("Por favor, rellena correctamente el formulario y añade una imagen.");
      return;
    }

    const precio = parseFloat(precioTexto.replace("€", "").trim());

    productos.push({
      nombre,
      precio,
      imagen: imagenSrc,
      alt: `Imagen de ${nombre}`
    });

    renderizarGaleria();

    formulario.reset();
    document.getElementById("vista-nombre").textContent = "Nombre del producto";
    document.getElementById("vista-precio").textContent = "0€";
    imagenVista.src = "";
    botonBorrar.style.display = "none";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarGaleria();
  inicializarFormularioProducto();

  document.getElementById("anadir-productos").addEventListener("click", mostrarAñadirProductos);
  document.getElementById("modo-eliminar").addEventListener("click", activarModoEliminar);
  document.getElementById("cerrar-formulario").addEventListener("click", () => {
    document.getElementById("formulario-productos").classList.add("oculto");
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.getElementById("formulario-productos").classList.add("oculto");

      if (modoEliminarActivo) {
        modoEliminarActivo = false;
        renderizarGaleria();
        document.getElementById("modo-eliminar").textContent = "Eliminar";
      }
    }
  });
});
