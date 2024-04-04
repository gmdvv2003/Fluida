class UserEntity {
  
  constructor(user_id, username, name, lastname, email, phone_number, hashedpassword){
    this.user_id = user_id;
    this.username = username;
    this.name = name;
    this.lastname = lastname;
    this.email = email;
    this.phone_number = phone_number;
    this.hashedpassword = hashedpassword;
  }

  sonarLint(){
    // APENAS PARA PARAR O SONARLINT
  }

}

module.exports = UserEntity;