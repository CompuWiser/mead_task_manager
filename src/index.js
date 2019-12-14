const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config();

const userRoutes = require('./routes/user_routes');
const taskRoutes = require('./routes/task_routes');

app.use(morgan(':method => :url \nstatus: :status || :response-time ms\n'));

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

const { PORT } = process.env;

require('./db/mongoose')
  .then(() => {
    console.log('Successfully Connected to Database');

    app.listen(PORT, () => {
      console.log('Server is up on http://localhost:' + PORT);
    });
  })
  .catch((err) => {
    console.error(err);
  });
