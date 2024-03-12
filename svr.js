import express from 'express';
import * as users from './users.js';
const app = express();
const port = 8080;

app.use(express.static('client'));

app.get('/users', (req, res) => res.json(users.getAllUsers()));
app.get('/user/:id', (req, res) => res.json(users.getUser(req.params.id)));

app.listen(8080);
console.log(`Listening on ${port}`);
