<template>
<div>    
    <v-row style="height: 500px;" v-if="signInOrNot">
      <v-col class="signup_card">
          <h1 class="display-1 my-5 signup_title">SIGN UP</h1>
          <v-form class="signup_v_form">
            <v-text-field label="メールアドレス" prepend-icon="mdi-account-circle" v-model="email"></v-text-field>
            <v-text-field label="パスワード" :type="inputType" prepend-icon="mdi-lock" :append-icon="isChecked ? 'mdi-eye-off' : 'mdi-eye'" v-model="password" @click:append="isChecked = !isChecked"></v-text-field>
              <v-btn class="px-5 my-5" color="teal" outlined @click="register">register</v-btn>
          </v-form>
          <p class="signup_banner">
            <v-icon class="mr-3 v_icon_signup">mdi-account-check</v-icon>
            アカウントをお持ちの場合はこちら
            <v-btn text color="primary" to="/Signin">Signin</v-btn>
          </p>
      </v-col>
      <v-col class="d-none">
    <v-dialog v-model="dialogOfFirstSetUsername" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>ユーザー名を登録しよう！</v-card-title>
        <v-form>
            <v-text-field class="mx-3" label="ユーザー名" v-model="username"></v-text-field>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="registerNewUsername">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      </v-col>
    </v-row>
</div>
</template>

<script>
import firebase from 'firebase'

export default {
    name: "Signup",
    data() {
        return {
            username: "",
            email: "",
            password: "",
            dialogOfFirstSetUsername: false,
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
        register() {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then(() => {
            })
            .catch(error => {
                alert(error);
            });
            let registerCard = document.getElementById('register_card');
            registerCard.classList.add('d-none');
            this.dialogOfFirstSetUsername = true;
        },

        registerNewUsername() {
            let user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: this.username,
            }).then( () => {
            }).catch( (error) => {
                alert(error);
            })
            this.$router.push('/Home');
        },
    }
}
</script>

<style scoped lang="scss">

.signup_card {

  .signup_v_form {
    width: 80%;
  }

  .signup_banner {
    width: 70%;
    margin: 20px 30px 20px;
  }


}

@media screen and (max-width: 1264px) {
  .signup_v_form {
    width: 80%;
    margin: 0 auto;
  }

  .signup_banner {
    width: 70%;
    text-align: center;
  }

  .signup_title {
    width: 80%;
    margin: 0 auto;
  }

}

</style>