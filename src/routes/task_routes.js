const router = require('express').Router();
const auth = require('../middleware/auth');
const taskController = require('../controllers/task_controller');

router.use(auth);

router.post('/tasks', taskController.addATask);

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', taskController.viewMyTasks);

router.get('/tasks/:id', taskController.viewATask);

router.patch('/tasks/:id', taskController.updateTask);

router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
