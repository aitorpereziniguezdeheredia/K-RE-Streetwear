const usuarios = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan@example.com",
    rol: "admin",
    estado: "activo",
  },
  {
    id: 2,
    nombre: "María Gómez",
    email: "maria@example.com",
    rol: "usuario",
    estado: "inactivo",
  },
  {
    id: 3,
    nombre: "Pedro Martínez",
    email: "pedro@example.com",
    rol: "editor",
    estado: "activo",
  },
  {
    id: 4,
    nombre: "Ana Torres",
    email: "ana.torres@example.com",
    rol: "moderador",
    estado: "activo",
  },
  {
    id: 5,
    nombre: "Luis Mendoza",
    email: "luis.m@example.com",
    rol: "usuario",
    estado: "activo",
  },
  {
    id: 6,
    nombre: "Elena Castro",
    email: "elena.cast@example.com",
    rol: "admin",
    estado: "inactivo",
  },
  {
    id: 7,
    nombre: "Carlos Ruiz",
    email: "cruiz@example.com",
    rol: "editor",
    estado: "activo",
  },
  {
    id: 8,
    nombre: "Lucía Romero",
    email: "lucia.r@example.com",
    rol: "usuario",
    estado: "activo",
  },
  {
    id: 9,
    nombre: "Fernando Salas",
    email: "fsalas@example.com",
    rol: "usuario",
    estado: "activo",
  },
  {
    id: 10,
    nombre: "Verónica Díaz",
    email: "verodiaz@example.com",
    rol: "editor",
    estado: "inactivo",
  },
  {
    id: 11,
    nombre: "Sofía López",
    email: "sofia.l@example.com",
    rol: "usuario",
    estado: "activo",
  },
  {
    id: 12,
    nombre: "Gabriel Reyes",
    email: "gabrielr@example.com",
    rol: "moderador",
    estado: "activo",
  },
  {
    id: 13,
    nombre: "Isabel Mora",
    email: "isam@example.com",
    rol: "usuario",
    estado: "activo",
  },
  {
    id: 14,
    nombre: "Ricardo Vega",
    email: "ricardov@example.com",
    rol: "admin",
    estado: "inactivo",
  },
  {
    id: 15,
    nombre: "Claudia Soto",
    email: "claudia.s@example.com",
    rol: "editor",
    estado: "activo",
  },
];

const tbody = document.querySelector("#tabla-usuarios tbody");
const inputBusqueda = document.getElementById("busqueda");

const usuariosPorPagina = 10;
let paginaActual = 1;

function renderTabla(lista) {
  tbody.innerHTML = "";
  const inicio = (paginaActual - 1) * usuariosPorPagina;
  const fin = inicio + usuariosPorPagina;
  const pagina = lista.slice(inicio, fin);

  pagina.forEach((usuario) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td data-label="ID">${usuario.id}</td>
        <td data-label="Nombre">${usuario.nombre}</td>
        <td data-label="Email">${usuario.email}</td>
        <td data-label="Rol">${usuario.rol}</td>
        <td data-label="Estado">${usuario.estado}</td>
        <td data-label="Acciones">
          <button onclick="editarUsuario(${usuario.id})">✏️</button>
          <button onclick="eliminarUsuario(${usuario.id})">🗑️</button>
        </td>
      `;
    tbody.appendChild(fila);
  });

  renderPaginacion(lista);
}

function renderPaginacion(lista) {
  const paginacion = document.getElementById("paginacion");
  paginacion.innerHTML = "";

  paginacion.innerHTML = "";
  const totalPaginas = Math.ceil(lista.length / usuariosPorPagina);

  if (paginaActual > 1) {na
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

function eliminarUsuario(id) {
  const index = usuarios.findIndex((u) => u.id === id);
  if (index !== -1) {
    usuarios.splice(index, 1);
    // Si eliminamos el último elemento de una página, retrocedemos una página si queda vacía
    const listaFiltrada = usuariosFiltrados();
    const totalPaginas = Math.ceil(listaFiltrada.length / usuariosPorPagina);
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;
    renderTabla(listaFiltrada);
  }
}

function editarUsuario(id) {
  const usuario = usuarios.find((u) => u.id === id);
  alert(
    `Simulación de edición:\nNombre: ${usuario.nombre}\nEmail: ${usuario.email}`
  );
}

function usuariosFiltrados() {
  const filtro = inputBusqueda.value.toLowerCase();
  return usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(filtro) ||
      usuario.email.toLowerCase().includes(filtro)
  );
}

inputBusqueda.addEventListener("input", () => {
  paginaActual = 1; // Reiniciar a la primera página al filtrar
  renderTabla(usuariosFiltrados());
});

renderTabla(usuarios);
