const mongoose = require('mongoose');

//require('dotenv').config();
// const { DATABASE_API, MONGO_CONNECTION_URL } = process.env;
// const mongooseURL = `${MONGO_CONNECTION_URL}/${DATABASE_API}`;
const {
  DB_USER,
  DB_PASSWORD,
  ATLAS_DB_NAME,
  ATLAS_CONNECTION_URL
} = process.env;

const mongooseURL = ATLAS_CONNECTION_URL
  .replace('<username>', DB_USER)
  .replace('<password>', DB_PASSWORD)
  .replace('<database>', ATLAS_DB_NAME);

module.exports = mongoose
  .connect(mongooseURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
