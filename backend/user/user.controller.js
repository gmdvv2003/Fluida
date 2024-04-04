const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const UserService = require('./user.service')
const userService = new UserService();

class UserController {

  findAll(req, res){
    const users = userService.findAll();
    res.json(users);
  }

  createUser(req, res) {
    const { user_id, username, name, lastname, email, phone_number, password } = req.body;
    const user = userService.createUser(user_id, username, name, lastname, email, phone_number, password);
    res.json(user);
  }

  login(req, res) {
    const { email, password } = req.body;
    try {
      const token = userService.login(email, password);
      res.json(token);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  logout(req, res) {
    const accessToken = req.headers['access_token'];
    try {
      userService.logout(accessToken);
      res.status(200).json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

}

module.exports = UserController;