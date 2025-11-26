const priorityCopy = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

const priorityClass = {
  alta: "priority-high",
  media: "priority-medium",
  baja: "priority-low",
};

const formatDate = (iso) => {
  if (!iso) return "Sin fecha";
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
  });
};

function TaskCard({ task, onToggle, onDelete }) {
  return (
    <article className={task.completed ? "task done" : "task"}>
      <div className="task-main">
        <div>
          <p className="task-title">{task.title}</p>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          <div className="task-meta">
            <span className={`pill ${priorityClass[task.priority]}`}>
              {priorityCopy[task.priority] || "Media"}
            </span>
            <span className="pill neutral">Entrega: {formatDate(task.dueDate)}</span>
          </div>
        </div>
      </div>
      <div className="task-actions">
        <button
          className="ghost"
          onClick={() => onToggle(task.id)}
          aria-label="Marcar tarea"
        >
          {task.completed ? "Reabrir" : "Completar"}
        </button>
        <button className="ghost danger" onClick={() => onDelete(task.id)}>
          Eliminar
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
