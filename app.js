let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

const form = document.getElementById('task-form');
const inputTitulo = document.getElementById('task-title');
const inputDesc = document.getElementById('task-desc');
const tabla = document.getElementById('task-list');
const mensajeError = document.getElementById('mensaje-error');

function guardarTareas() {
  localStorage.setItem('tareas', JSON.stringify(tareas));
}

function mostrarTareas() {
  tabla.innerHTML = '';

  tareas.forEach((tarea, index) => {
    const fila = document.createElement('tr');

    if(tarea.completada) fila.classList.add('completada');

    const celdaTitulo = document.createElement('td');
    celdaTitulo.textContent = tarea.titulo;

    const celdaDesc = document.createElement('td');
    celdaDesc.textContent = tarea.descripcion;

    const celdaAcciones = document.createElement('td');

    const iconoCompletar = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    iconoCompletar.setAttribute("viewBox", "0 0 24 24");
    iconoCompletar.classList.add("icono");

    if(tarea.completada) {
      iconoCompletar.classList.add("icono-deshacer");
      iconoCompletar.innerHTML = `<path d="M15 6l-6 6 6 6" stroke="#fbbf24" stroke-width="2" fill="none"/>`;
    } else {
      iconoCompletar.classList.add("icono-completar");
      iconoCompletar.innerHTML = `<path d="M20 6L9 17l-5-5" stroke="#22c55e" stroke-width="2" fill="none"/>`;
    }
    iconoCompletar.onclick = () => {
      marcarCompletada(index);
    };

    const iconoEliminar = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    iconoEliminar.setAttribute("viewBox", "0 0 24 24");
    iconoEliminar.classList.add("icono", "icono-eliminar");
    iconoEliminar.innerHTML = `<path d="M6 6l12 12M18 6L6 18" stroke="#ef4444" stroke-width="2" fill="none"/>`;
    iconoEliminar.onclick = () => eliminarTarea(index);

    celdaAcciones.appendChild(iconoCompletar);
    celdaAcciones.appendChild(iconoEliminar);

    fila.appendChild(celdaTitulo);
    fila.appendChild(celdaDesc);
    fila.appendChild(celdaAcciones);

    tabla.appendChild(fila);
  });
}

function agregarTarea(titulo, descripcion) {
  tareas.push({
    titulo,
    descripcion,
    completada: false
  });
  guardarTareas();
  mostrarTareas();
}

function eliminarTarea(index) {
  if (confirm('¿Seguro que querés eliminar esta tarea?')) {
    tareas.splice(index, 1);
    guardarTareas();
    mostrarTareas();
  }
}

function marcarCompletada(index) {
  tareas[index].completada = !tareas[index].completada;
  guardarTareas();
  mostrarTareas();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const titulo = inputTitulo.value.trim();
  const desc = inputDesc.value.trim();

  if (titulo === '' || desc === '') {
    mensajeError.textContent = 'Debe completar el nombre y la descripción';
    return;
  }

  if (titulo.length > 50 || desc.length > 50) {
    mensajeError.textContent = 'Los campos no pueden contener más de 50 caracteres';
    return;
  }

  mensajeError.textContent = '';
  agregarTarea(titulo, desc);
  inputTitulo.value = '';
  inputDesc.value = '';
});

inputTitulo.addEventListener('input', () => {
  mensajeError.textContent = '';
});

inputDesc.addEventListener('input', () => {
  mensajeError.textContent = '';
});

mostrarTareas();
