import { useEffect, useMemo, useState } from "react";
import TaskForm from "./components/tasks/TaskForm";
import TaskList from "./components/tasks/TaskList";
import TaskFilters from "./components/tasks/TaskFilters";
import Snackbar from "./components/ui/Snackbar";
import { createTask, fetchTasks, removeTask, toggleTask } from "./api/tasks";
import "./App.css";

const FILTERS = {
  all: { label: "Todas", fn: () => true },
  pending: { label: "Pendientes", fn: (task) => !task.completed },
  done: { label: "Completadas", fn: (task) => task.completed },
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ message: "", type: "info" });
  const [formResetKey, setFormResetKey] = useState(0);

  const openSnackbar = (message, type = "info") => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar({ message: "", type: "info" }), 3000);
  };

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError("No pudimos cargar las tareas. Intenta más tarde.");
      console.error(err);
      const msg =
        err.message?.includes("Failed to fetch") || err.message?.includes("refused")
          ? "No se pudo conectar con el servidor. ¿Está el backend corriendo?"
          : "No pudimos cargar las tareas.";
      openSnackbar(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (payload) => {
    try {
      const newTask = await createTask(payload);
      setTasks((prev) => [newTask, ...prev]);
      openSnackbar("Tarea creada", "success");
    } catch (err) {
      setError("No pudimos crear la tarea.");
      console.error(err);
      openSnackbar(err.message || "No pudimos crear la tarea.", "error");
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await toggleTask(id);
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    } catch (err) {
      setError("No pudimos actualizar la tarea.");
      console.error(err);
      openSnackbar(err.message || "No pudimos actualizar la tarea.", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      openSnackbar("Tarea eliminada", "warning");
    } catch (err) {
      setError("No pudimos borrar la tarea.");
      console.error(err);
      openSnackbar(err.message || "No pudimos borrar la tarea.", "error");
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(FILTERS[filter].fn);
  }, [tasks, filter]);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      done: tasks.filter((t) => t.completed).length,
      pending: tasks.filter((t) => !t.completed).length,
    }),
    [tasks]
  );

  return (
    <div className="page">
      <header className="hero">
        <div>
          <h1>Organiza tu proyecto con un gestor de tareas simple y efectivo.</h1>
          <p className="lede">
            Crea, marca y prioriza tareas en segundos. Mantén el enfoque y comparte avances
            con tu equipo.
          </p>
          <div className="hero-meta">
            <span className="pill success">Pendientes: {stats.pending}</span>
            <span className="pill neutral">Completadas: {stats.done}</span>
            <span className="pill accent">Total: {stats.total}</span>
          </div>
        </div>
      </header>

      <main className="layout">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Nueva tarea</p>
              <h2>Carga rápida</h2>
            </div>
            <div className="panel-actions">
              <button
                className="ghost icon-btn"
                onClick={() => setFormResetKey((k) => k + 1)}
                title="Limpiar formulario"
                type="button"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-refresh">
                  <path
                    d="M4 4v6h6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 20v-6h-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 13a7 7 0 0 0 12 3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M19 11a7 7 0 0 0-12-3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
          <TaskForm onSubmit={handleCreate} loading={loading} key={formResetKey} />
          {error && <p className="error">{error}</p>}
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Tus tareas</p>
              <h2>Tablero</h2>
            </div>
            <TaskFilters active={filter} onChange={setFilter} filters={FILTERS} />
          </div>
          <TaskList
            loading={loading}
            tasks={filteredTasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </section>
      </main>

      <Snackbar open={!!snackbar.message} type={snackbar.type}>
        {snackbar.message}
      </Snackbar>
    </div>
  );
}

export default App;
