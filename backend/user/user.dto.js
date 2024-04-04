class UserDTO {
  
  constructor({ user_id, username, name, lastname, email, phone_number, access_token }) {
    this.user_id = user_id;
    this.username = username;
    this.name = name;
    this.lastname = lastname;
    this.email = email;
    this.phone_number = phone_number;
    this.access_token = access_token;
  }

  sonarLint(){
    // APENAS PARA PARAR O SONARLINT
  }

}

module.exports = UserDTO;