# Informe de la aplicación (Parcial 2)

## Estructura de carpetas
- `backend/`
  - `src/server.js`: entrada de Express (CORS, JSON, rutas).
  - `src/routes/taskRoutes.js`: enrutado REST de tareas.
  - `src/controllers/taskController.js`: lógica de negocio (listar, crear, toggle, actualizar, eliminar, validación).
  - `src/storage/taskStore.js`: lectura/escritura en `data/tasks.json`.
  - `data/tasks.json`: persistencia en JSON.
- `frontend/`
  - `src/App.jsx`: layout principal y orquestación de estado.
  - `src/api/tasks.js`: capa de fetch a `/api/tasks` (base configurable con `VITE_API_URL`).
  - `src/components/tasks/`: `TaskForm`, `TaskList`, `TaskCard`, `TaskFilters`.
  - `src/components/ui/Snackbar.jsx`: mensajes dinámicos.
  - `public/logo.svg`: favicon.

## Flujo general de la aplicación
1) Al cargar el frontend, `App.jsx` llama a `fetchTasks()` y muestra métricas (pendientes, completadas, total) más el tablero de tareas.
2) Formulario controlado (`TaskForm`) envía `POST /api/tasks`; al crear se inserta en la lista y se muestra snackbar.
3) Cada tarea permite marcar como completada (`PATCH /api/tasks/:id/toggle`) o eliminar (`DELETE /api/tasks/:id`). La lista se actualiza en memoria sin recargar toda la página.
4) El botón de recarga en el formulario limpia los campos (no afecta el tablero).

## Ejemplos de intercambio de datos (JSON)
- Listar tareas: `GET /api/tasks`
  - Respuesta `200`:
    ```json
    [
      {
        "id": "seed-1",
        "title": "Revisar backlog",
        "description": "Priorizar tareas pendientes de la semana",
        "priority": "alta",
        "completed": false,
        "createdAt": "2024-05-01T12:00:00.000Z",
        "dueDate": null
      }
    ]
    ```

- Crear tarea: `POST /api/tasks`
  - Body:
    ```json
    {
      "title": "Enviar informe",
      "description": "Adjuntar métricas",
      "priority": "media",
      "dueDate": "2025-12-01"
    }
    ```
  - Respuesta `201`:
    ```json
    {
      "id": "uuid-generado",
      "title": "Enviar informe",
      "description": "Adjuntar métricas",
      "priority": "media",
      "completed": false,
      "createdAt": "2025-11-26T00:00:00.000Z",
      "dueDate": "2025-12-01T00:00:00.000Z"
    }
    ```

- Marcar/alternar completada: `PATCH /api/tasks/{id}/toggle`
  - Respuesta `200`: tarea actualizada con `completed` invertido y `updatedAt`.

- Eliminar: `DELETE /api/tasks/{id}`
  - Respuesta `204` sin body.

## Scripts de ejecución
- Backend: `cd backend && npm start` (puerto 3000).
- Frontend: `cd frontend && npm run dev` (proxy `/api` → `localhost:3000`); opcional `VITE_API_URL` para apuntar a otro host en producción.
