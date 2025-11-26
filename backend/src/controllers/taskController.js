const crypto = require("crypto");
const { readTasks, saveTasks } = require("../storage/taskStore");

const parseTask = (body) => {
  const title = (body.title || "").trim();
  const description = (body.description || "").trim();
  const priority = (body.priority || "media").toLowerCase();
  const rawDueDate = body.dueDate ? new Date(body.dueDate) : null;
  if (body.dueDate && Number.isNaN(rawDueDate.getTime())) {
    return { error: "La fecha de entrega no es válida." };
  }
  const dueDate = rawDueDate ? rawDueDate.toISOString() : null;

  if (!title) {
    return { error: "El título es obligatorio." };
  }

  const allowedPriorities = ["alta", "media", "baja"];
  if (!allowedPriorities.includes(priority)) {
    return { error: "La prioridad debe ser alta, media o baja." };
  }

  return { title, description, priority, dueDate };
};

const findTaskIndex = (tasks, id) => tasks.findIndex((task) => task.id === id);
const safeBoolean = (value, fallback) => {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
};

module.exports = {
  list: (_req, res) => {
    const tasks = readTasks();
    res.json(tasks);
  },

  create: (req, res) => {
    const parsed = parseTask(req.body);
    if (parsed.error) {
      return res.status(400).json({ error: parsed.error });
    }

    const tasks = readTasks();
    const newTask = {
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
      ...parsed,
    };

    tasks.push(newTask);
    saveTasks(tasks);
    res.status(201).json(newTask);
  },

  updateStatus: (req, res, next) => {
    try {
      const tasks = readTasks();
      const index = findTaskIndex(tasks, req.params.id);

      if (index === -1) {
        return res.status(404).json({ error: "Tarea no encontrada" });
      }

      const completed = safeBoolean(
        req.body && Object.prototype.hasOwnProperty.call(req.body, "completed")
          ? req.body.completed
          : undefined,
        !tasks[index].completed
      );

      tasks[index] = {
        ...tasks[index],
        completed,
        updatedAt: new Date().toISOString(),
      };

      saveTasks(tasks);
      res.json(tasks[index]);
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      next(err);
    }
  },

  update: (req, res) => {
    const tasks = readTasks();
    const index = findTaskIndex(tasks, req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    const parsed = parseTask({
      title: req.body.title ?? tasks[index].title,
      description: req.body.description ?? tasks[index].description,
      priority: req.body.priority ?? tasks[index].priority,
      dueDate: req.body.dueDate ?? tasks[index].dueDate,
    });

    if (parsed.error) {
      return res.status(400).json({ error: parsed.error });
    }

    tasks[index] = {
      ...tasks[index],
      ...parsed,
      updatedAt: new Date().toISOString(),
    };

    saveTasks(tasks);
    res.json(tasks[index]);
  },

  remove: (req, res) => {
    const tasks = readTasks();
    const filtered = tasks.filter((task) => task.id !== req.params.id);

    if (filtered.length === tasks.length) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    saveTasks(filtered);
    res.status(204).send();
  },
};
