import TaskCard from "./TaskCard";

function TaskList({ tasks, onToggle, onDelete, loading }) {
  if (loading) {
    return <p className="muted">Cargando...</p>;
  }

  if (!tasks.length) {
    return <p className="muted">No hay tareas con este filtro.</p>;
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;
