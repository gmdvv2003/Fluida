const UserEntity = require('./user.entity.js')
const UserDTO = require('./user.dto.js')

const users = [
  {
    user_id: "0", 
    username: "user01", 
    name: "Guilherme", 
    lastname: "Daghlian", 
    email: "gulhermedaghlian@hotmail.com", 
    phone_number: "9999999999999", 
    hashedpassword: "abcdef123456"
  },
  {
    user_id: "1", 
    username: "user02", 
    name: "Stefani", 
    lastname: "Marchi", 
    email: "stefanimarchi@hotmail.com", 
    phone_number: "8888888888888", 
    hashedpassword: "abcedf098765"
  },
  {
    user_id: "2", 
    username: "user03", 
    name: "Gustavo", 
    lastname: "Gino Terezo", 
    email: "gustavogino@hotmail.com", 
    phone_number: "7777777777777", 
    hashedpassword: "abcedf567890"
  },
  {
    user_id: "3", 
    username: "user04", 
    name: "Victor", 
    lastname: "Muza", 
    email: "victormuza@hotmail.com", 
    phone_number: "6666666666666", 
    hashedpassword: "abcedf456789"
  },
  {
    user_id: "4", 
    username: "user05", 
    name: "Diego", 
    lastname: "Galhardo", 
    email: "diegogalhardo@hotmail.com", 
    phone_number: "5555555555555", 
    hashedpassword: "abcedf234567"
  },
]

class UserService {

  findAll(){
    return users.map((user) => new UserDTO(user));
  }
  
  createUser(user_id, username, name, lastname, email, phone_number, hashedpassword){
    const newUser = new UserEntity(user_id, username, name, lastname, email, phone_number, hashedpassword);
    users.push(newUser);
    return newUser;
  }

}

module.exports = UserService;