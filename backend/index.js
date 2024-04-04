const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
app.use(bodyParser.json());

// ====================================================================================

// REQUIRES

const UserController = require('./user/user.controller.js')

// ====================================================================================

// INSTÂNCIAS

const userControler = new UserController();

// ====================================================================================

// ENDPOINTS

app.get('/users', (req, res) => userControler.findAll(req, res))
app.post('/users/register', (req, res) => userControler.createUser(req, res));

// ====================================================================================

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});