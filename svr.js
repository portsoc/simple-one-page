import express from 'express';
import * as users from './users.js';
import * as url from 'url';

const app = express();
const port = 8080;
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


function getUsers(req, res) {
  res.json(users.getAllUsers());
}

function getUser(req, res) {
  res.json(users.getUser(req.params.id));
}

/* handle calls to /app (as these are in-app links, they need to be handled by index.html) */
function handleAppUrls(req, res) {
  res.sendFile(`${__dirname}/client/index.html`);
}

function notFound(req, res) {
  res.status(404).sendFile(`${__dirname}/server-error-pages/404.html`);
}


function updateFood(req, res) {
  if (!req.body || !req.body.id || !req.body.food || !req.body.index) {
    res.sendStatus(400);
  } else {
    const saved = users.editFood(req.body.id, req.body.food, req.body.index);
    if (saved) {
      res.json(users.getUser(req.body.id));
    } else {
      res.sendStatus(500);
    }
  }
}

app.use(express.static('client'));

/// Our entire API can be seen in five lines here
app.get('/users', getUsers);
app.get('/user/:id', getUser);
app.get('/app/*subpage/', handleAppUrls);
app.put('/user', express.json(), updateFood);
app.all('*all', notFound);

app.listen(8080);
console.log(`Listening on ${port}`);
