import regeneratorRuntime from "regenerator-runtime";
import express from 'express';
import mongoose from 'mongoose';

import config from './config'

import {auth, admin, profile} from './routes'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}))


app.use('/api/v1/users', auth);
app.use('/api/v1/admin', admin);
app.use('/api/v1/users/profile', profile);


app.use((err, req, res, next) => {
    res.status(500).json({
      status: 'fail',
      error: err.message
    });
});


const DB_URL = config.databaseUrl[config.environment];

mongoose.connect(
  DB_URL, 
  {
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
      useCreateIndex: true, 
      useFindAndModify: false
  }
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('successfully connected to database', DB_URL);
})

app.listen(config.port, () => {
  console.log(`app running on port ${config.port}`)
})