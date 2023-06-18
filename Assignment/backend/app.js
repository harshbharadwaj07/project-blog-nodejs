require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
require('./db/connection');

// Requiring database schema
const jobsSchema = require('./models/jobs');
const eventsSchema = require('./models/events');
const blogsSchema = require('./models/blogs');

const Job = mongoose.model('Job', jobsSchema);
const Event = mongoose.model('Event', eventsSchema);
const Blog = mongoose.model('Blog',blogsSchema);

// Routes
app.get('/jobs', async function (req, res) {
  try {
    const jobs = await Job.find({});
    res.status(200).send(jobs);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.get('/events', async function (req, res) {
  try {
    const evts = await Event.find({});
    res.status(200).send(evts);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.get('/blogs',async function(req,res){
    try{
        const blgs= await Blog.find({});
        res.status(200).send(blgs);
    }catch(error){
        res.status(400).send({ error: error.message });
    }
});

app.post('/search', async function(req, res) {
    const { str } = req.body;

    const query = str ? {
        $or: [
            { title: { $regex: str, $options: "i" } },
            { post: { $regex: str, $options: "i" } }
        ]
    } : {};

    const result = await Blog.find(query);
    res.status(200).send(result);
});

app.post('/filter', async function(req, res) {
  const { str } = req.body;
  const query = str ? {
    $or: [
        { type: { $regex: str, $options: "i" } }
    ]
} : {};
  const result = await Blog.find(query);
  res.status(200).send(result);
});

let port=process.env.PORT;
app.listen(port, function (req, res) {
  console.log('Server started at port '+port);
});