const Task = require('../models/task_model');

exports.addATask = async function addATask(req, res) {
  const task = new Task({
    ...req.body,
    owner: req.user._id
})

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
};

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
exports.viewMyTasks = async function viewMyTasks(req, res) {
  const {completed, sortBy, limit, skip} = req.query;

  const populateFilter = {path: 'tasks'};

  if (completed) {
    populateFilter.match = {};
    populateFilter.match.completed = completed === 'true';
  }

  if (limit || skip || sortBy) {
    populateFilter.options = {};

    if (sortBy) {
      const parts = sortBy.split(':');
      const sortProperty = parts[0];
      const order = parts[1] === 'desc' ? -1 : 1;
  
      populateFilter.options.sort = {};
      populateFilter.options.sort[sortProperty] = order;
    }

    if (limit) {
      populateFilter.options.limit = parseInt(limit);
    }
  
    if (skip) {
      populateFilter.options.skip = parseInt(skip);
    }
  }
  
  try {
    // const tasks = await Task.find({ owner: req.user._id});
    await req.user
      .populate(populateFilter)
      .execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
};

exports.viewATask = async function viewATask(req, res) {
  const _id = req.params.id;
  const owner = req.user._id;

  try {
    const task = await Task.findOne({ _id, owner });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
};

exports.updateTask = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((field) => {
      task[field] = req.body[field];
    });
    await task.save();

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
};
