const UserEntity = require('./user.entity.js')
const UserDTO = require('./user.dto.js')

const jwt = require('jsonwebtoken');

const users = [
  {
    user_id: "0", 
    username: "user01", 
    name: "Guilherme", 
    lastname: "Daghlian", 
    email: "gulhermedaghlian@hotmail.com", 
    phone_number: "9999999999999", 
    password: "abcdef123456",
    access_token: ""
  },
  {
    user_id: "1", 
    username: "user02", 
    name: "Stefani", 
    lastname: "Marchi", 
    email: "stefanimarchi@hotmail.com", 
    phone_number: "8888888888888", 
    password: "abcedf098765",
    access_token: ""
  },
  {
    user_id: "2", 
    username: "user03", 
    name: "Gustavo", 
    lastname: "Gino Terezo", 
    email: "gustavogino@hotmail.com", 
    phone_number: "7777777777777", 
    password: "abcedf567890",
    access_token: ""
  },
  {
    user_id: "3", 
    username: "user04", 
    name: "Victor", 
    lastname: "Muza", 
    email: "victormuza@hotmail.com", 
    phone_number: "6666666666666", 
    password: "abcedf456789",
    access_token: ""
  },
  {
    user_id: "4", 
    username: "user05", 
    name: "Diego", 
    lastname: "Galhardo", 
    email: "diegogalhardo@hotmail.com", 
    phone_number: "5555555555555", 
    password: "abcedf234567",
    access_token: ""
  },
]

class UserService {

  findAll(){
    return users.map((user) => new UserDTO(user));
  }
  
  createUser(user_id, username, name, lastname, email, phone_number, password){
    const newUser = new UserEntity(user_id, username, name, lastname, email, phone_number, password);
    users.push(newUser);
    return newUser;
  }

  login(email, password){
    const userIndex = users.findIndex(user => user.email === email && user.password === password);
    if (userIndex === -1) {
      throw new Error('Credenciais inválidas');
    }

    const user = users[userIndex];

    const token = jwt.sign({ email: user.email }, 'seuSegredoJWT', { expiresIn: '3h' });

    // Atualize o token no objeto do usuário no array
    users[userIndex].access_token = token;

    // Retorna um objeto contendo as informações do usuário e o token
    return {
      user_id: user.user_id,
      username: user.username,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      phone_number: user.phone_number,
      token: token
    };
  }

  logout(accessToken) {
    const userIndex = users.findIndex(user => user.access_token === accessToken);
    if (userIndex === -1) {
      throw new Error('Token de acesso inválido');
    }

    // Limpar o access_token do objeto do usuário
    users[userIndex].access_token = '';

    return true; // Indicando que o logout foi realizado com sucesso
  }

}

module.exports = UserService;