const express = require("express");
const taskController = require("../controllers/taskController");

const router = express.Router();

router.get("/", taskController.list);
router.post("/", taskController.create);
router.patch("/:id/toggle", taskController.updateStatus);
router.put("/:id", taskController.update);
router.delete("/:id", taskController.remove);

module.exports = router;
