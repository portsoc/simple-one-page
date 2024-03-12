import express from 'express';
import * as users from './users.js';
import * as url from 'url';

const app = express();
const port = 8080;
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

app.use(express.static('client'));

app.get('/users', (req, res) => res.json(users.getAllUsers()));
app.get('/user/:id', (req, res) => res.json(users.getUser(req.params.id)));

/* final catch-all route to index.html defined last */
app.get('/app/*/', (req, res) => {
  console.log(req.params);
  res.sendFile(`${__dirname}/client/index.html`);
});

app.listen(8080);
console.log(`Listening on ${port}`);
