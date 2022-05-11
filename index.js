const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user',userRouter);
app.use('/blog',blogRouter);

module.exports = app;