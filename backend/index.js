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

const userController = new UserController();

// ====================================================================================

// ENDPOINTS

// USERS
app.get('/users', (req, res) => userController.findAll(req, res))
app.post('/users/register', (req, res) => userController.createUser(req, res));
app.post('/users/login', (req, res) => userController.login(req, res));
app.post('/users/logout', (req, res) => userController.logout(req, res));

// PROJECTS

// ====================================================================================

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});