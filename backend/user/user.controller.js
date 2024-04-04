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

}

module.exports = UserController;