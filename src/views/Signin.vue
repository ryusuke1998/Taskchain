<template>
    <v-row style="height: 500px;" v-if="signInOrNot">
      <v-col class="login_card">
          <h1 class="display-1 my-5 signin_title">SIGN IN</h1>
          <v-form class="v_form">
            <v-text-field label="メールアドレス" prepend-icon="mdi-account-circle" v-model="username"></v-text-field>
            <v-text-field label="パスワード" :type="inputType" prepend-icon="mdi-lock" :append-icon="isChecked ? 'mdi-eye-off' : 'mdi-eye'" v-model="password" @click:append="isChecked = !isChecked"></v-text-field>
              <v-btn class="px-5 my-5" @click="SignIn" color="teal" outlined>Signin</v-btn>
          </v-form>
          <p class="banner_forsignup">
            <v-icon class="mr-3">mdi-account-plus</v-icon>
            アカウントをお持ちでない場合はこちら
            <v-btn text color="primary" class="signup_btn" @click="pushLinkOfSignup">Signup</v-btn>
          </p>
      </v-col>
    </v-row>
</template>

<script>

import firebase from 'firebase'

export default {
  name: "Signin",
  data(){
    return{
     username: "",
     password: "", 
     isLogin: false,
     isChecked: false,
     isSigned: false,
    }
  },
  computed: {
    inputType() {
      return this.isChecked ? "text" : "password";
    },
    signInOrNot() {
      firebase.auth().onAuthStateChanged((user) => {
        if(user) {
          this.isSigned = false;
        }else {
          this.isSigned = true;
        }
      })
      return this.isSigned;
    },
  },
  methods: {
    pushLinkOfSignup(){
      this.$router.push('/Signup');
    },
    SignIn(){

      firebase.auth().signInWithEmailAndPassword(this.username, this.password).then(
        () => {
          this.$router.push('/Home');
        },
        error => {
          alert(error);
        }
      );
    }
  }
}
</script>

<style scope lang="scss">

.login_card {
  margin: 0 auto;

  .signin_title {
    width: 80%;
  }

  .v_form {
    width:80%;
  }

  .banner_forsignup {
    width: 70%;
    margin: 20px 30px 20px;
  }
}

@media screen and (max-width: 1264px) {
  .v_form {
    width:80%;
    margin: 0 auto;
  }

  .banner_forsignup {
    width: 70%;
    text-align: center;
  }

  .signin_title {
    width: 80%;
    margin: 0 auto;
  }
} 

@media screen and (max-width: 600px) {
}

</style>