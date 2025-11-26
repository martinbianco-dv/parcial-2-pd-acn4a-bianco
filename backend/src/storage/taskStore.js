const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "..", "data", "tasks.json");

const ensureFile = () => {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, "[]");
  }
};

const readTasks = () => {
  ensureFile();
  const raw = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(raw);
};

const saveTasks = (tasks) => {
  ensureFile();
  fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
};

module.exports = { readTasks, saveTasks };
