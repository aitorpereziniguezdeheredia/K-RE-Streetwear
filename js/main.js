const tbody = document.querySelector("#tabla-usuarios tbody");
const inputBusqueda = document.getElementById("busqueda");
const modal = document.getElementById("modal");
const modalForm = document.getElementById("modalForm");
const modalCloseBtn = document.getElementById("modalClose");

// Nueva sección para mostrar detalles completos en modo "ver"
const modalDetalles = document.getElementById("modalDetalles");
const modalCloseDetailBtn = document.querySelector("#modalDetalles .modal-close-detail"); // Nueva referencia al botón de cerrar de detalles

const usuariosPorPagina = 10;
let paginaActual = 1;
let usuarios = [];

async function cargarUsuarios() {
  try {
    const res = await fetch("../API/user.json");
    usuarios = await res.json();
    renderTabla(usuarios);
  } catch (e) {
    console.error("Error cargando usuarios:", e);
  }
}

function renderTabla(lista) {
  tbody.innerHTML = "";
  const inicio = (paginaActual - 1) * usuariosPorPagina;
  const fin = inicio + usuariosPorPagina;
  const pagina = lista.slice(inicio, fin);

  pagina.forEach(usuario => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td data-label="ID">${usuario.id}</td>
      <td data-label="Nombre">${usuario.name}</td>
      <td data-label="Email">${usuario.email}</td>
      <td data-label="Rol">${usuario.role}</td>
      <td data-label="Estado">${usuario.isActive ? "Activo" : "Inactivo"}</td>
      <td data-label="Teléfono">${usuario.profile?.phone || ""}</td>
      <td data-label="Ciudad">${usuario.profile?.address?.city || ""}</td>
      <td data-label="Acciones">
        <button onclick="abrirModal(${usuario.id}, 'ver')" title="Ver detalles">👁️</button>
        <button onclick="abrirModal(${usuario.id}, 'editar')" title="Editar">✏️</button>
        <button onclick="eliminarUsuario(${usuario.id})" title="Eliminar">🗑️</button>
      </td>
    `;
    tbody.appendChild(fila);
  });

  renderPaginacion(lista);
}

function renderPaginacion(lista) {
  const paginacion = document.getElementById("paginacion");
  paginacion.innerHTML = "";

  const totalPaginas = Math.ceil(lista.length / usuariosPorPagina);

  if (paginaActual > 1) {
    const btnAnterior = document.createElement("button");
    btnAnterior.textContent = "◀ Anterior";
    btnAnterior.onclick = () => {
      paginaActual--;
      renderTabla(usuariosFiltrados());
    };
    paginacion.appendChild(btnAnterior);
  }

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.style.margin = "0 4px";
    btn.disabled = i === paginaActual;
    btn.onclick = () => {
      paginaActual = i;
      renderTabla(usuariosFiltrados());
    };
    paginacion.appendChild(btn);
  }

  if (paginaActual < totalPaginas) {
    const btnSiguiente = document.createElement("button");
    btnSiguiente.textContent = "Siguiente ▶";
    btnSiguiente.onclick = () => {
      paginaActual++;
      renderTabla(usuariosFiltrados());
    };
    paginacion.appendChild(btnSiguiente);
  }
}

function usuariosFiltrados() {
  const filtro = inputBusqueda.value.toLowerCase();
  return usuarios.filter(usuario =>
    usuario.name.toLowerCase().includes(filtro) ||
    usuario.email.toLowerCase().includes(filtro) ||
    usuario.role.toLowerCase().includes(filtro) ||
    (usuario.profile?.phone || "").toLowerCase().includes(filtro) ||
    (usuario.profile?.address?.city || "").toLowerCase().includes(filtro)
  );
}

function eliminarUsuario(id) {
  const index = usuarios.findIndex(u => u.id === id);
  if (index !== -1) {
    usuarios.splice(index, 1);
    const listaFiltrada = usuariosFiltrados();
    const totalPaginas = Math.ceil(listaFiltrada.length / usuariosPorPagina);
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;
    renderTabla(listaFiltrada);
  }
}

// Función para abrir el modal en modo 'ver' o 'editar'
window.abrirModal = function(id, modo = 'ver') {
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) return;

  modal.style.display = "block";

  if (modo === 'editar') {
    // Mostrar formulario y ocultar detalles
    modalForm.style.display = 'block';
    modalDetalles.style.display = 'none';

    // Rellenar formulario
    modalForm.id.value = usuario.id;
    modalForm.name.value = usuario.name;
    modalForm.email.value = usuario.email;
    modalForm.role.value = usuario.role;
    modalForm.isActive.value = usuario.isActive.toString();
    modalForm.phone.value = usuario.profile?.phone || "";
    modalForm.city.value = usuario.profile?.address?.city || "";

    // Habilitar inputs para edición
    Array.from(modalForm.elements).forEach(el => {
      if (el.tagName === "BUTTON") return;
      el.disabled = false;
    });

    // Mostrar botón Guardar y cambiar texto botón cerrar
    modalForm.querySelector('button[type="submit"]').style.display = 'inline-block';
    modalCloseBtn.textContent = 'Cancelar';

  } else {
    // Modo "ver" — mostrar detalles completos y ocultar formulario
    modalForm.style.display = 'none';
    modalDetalles.style.display = 'block';

    // Construir el contenido HTML con todos los datos del usuario
    modalDetalles.innerHTML = `
      <h3>Detalles de Usuario</h3>
      <p><strong>ID:</strong> ${usuario.id}</p>
      <p><strong>Nombre:</strong> ${usuario.name}</p>
      <p><strong>Email:</strong> ${usuario.email}</p>
      <p><strong>Rol:</strong> ${usuario.role}</p>
      <p><strong>Estado:</strong> ${usuario.isActive ? "Activo" : "Inactivo"}</p>
      <p><strong>Teléfono:</strong> ${usuario.profile?.phone || "N/A"}</p>
      <p><strong>Ciudad:</strong> ${usuario.profile?.address?.city || "N/A"}</p>
      <p><strong>Dirección completa:</strong> ${usuario.profile?.address?.street || "N/A"}, ${usuario.profile?.address?.zip || "N/A"}</p>
      <p><strong>Fecha de registro:</strong> ${usuario.registeredDate || "N/A"}</p>
      <p><strong>Notas:</strong> ${usuario.notes || "N/A"}</p>
      <button  title="Cerrar"><a href="usuarios.html">Cerrar</a></button>
    `;

    // Cambiar texto botón cerrar
    modalCloseDetailBtn.textContent = 'Cerrar';
  }
};

// Cerrar modal y resetear formulario
modalCloseBtn.onclick = () => {
  modal.style.display = "none";
  modalForm.reset();
  modalDetalles.innerHTML = "";
};

// Guardar cambios en modo editar
modalForm.onsubmit = e => {
  e.preventDefault();

  const id = parseInt(modalForm.id.value, 10);
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) return;

  usuario.name = modalForm.name.value;
  usuario.email = modalForm.email.value;
  usuario.role = modalForm.role.value;
  usuario.isActive = modalForm.isActive.value === "true";

  if (!usuario.profile) usuario.profile = {};
  usuario.profile.phone = modalForm.phone.value;

  if (!usuario.profile.address) usuario.profile.address = {};
  usuario.profile.address.city = modalForm.city.value;

  modal.style.display = "none";

  renderTabla(usuariosFiltrados());
};

inputBusqueda.addEventListener("input", () => {
  paginaActual = 1;
  renderTabla(usuariosFiltrados());
});

// Asegura que el DOM esté completamente cargado antes de ejecutar el script.
document.addEventListener("DOMContentLoaded", function() {
    // Referencias a elementos clave del DOM: checkbox del menú y la etiqueta <body>.
    const menuCheckbox = document.getElementById("menu-tienda");
    const body = document.body;

    // Si el checkbox existe, añade un listener para cambios de estado.
    if (menuCheckbox) {
        menuCheckbox.addEventListener("change", function() {
            // Alterna la clase "menu-open" en el <body>.
            // Esta clase es usada en CSS para desplazar el contenido o activar el menú.
            if (this.checked) {
                body.classList.add("menu-open");
            } else {
                body.classList.remove("menu-open");
            }
        });
    }
});

// Carga inicial
cargarUsuarios();
