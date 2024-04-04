class UserEntity {
  
  constructor(userData){
    this.user_id = userData.user_id;
    this.username = userData.username;
    this.name = userData.name;
    this.lastname = userData.lastname;
    this.email = userData.email;
    this.phone_number = userData.phone_number;
    this.password = userData.password;
    this.access_token = userData.access_token;
  }

  sonarLint(){
    // APENAS PARA PARAR O SONARLINT
  }

}

module.exports = UserEntity;