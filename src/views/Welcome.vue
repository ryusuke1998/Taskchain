<template>
  <v-row style="height:500px;" color="">
    <v-col>
    <div class="flex_img_catch">
      <div class="img_style">
        <img src="../img/Scrum board-amico.png" alt="" style="width:75%;">
      </div>
      <div class="catch">
      <h1>結果が見えるタスク共有ツール</h1>
      <p>皆がこなしたタスクを確認してモチベーションアップ</p>
      <p class="signin_btn_p"><a href="/Signin" class="signin_btn">Sign In</a></p>
      <p class="confirm_thisapp"><a href="https://note.com/ryusuke1/n/nbd380f3920f2">このアプリの使い方を確認</a></p>
      </div>
    </div>
    </v-col>
  </v-row>
</template>

<script>

import firebase from 'firebase'

export default {
  data() {
    return {

    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.$router.push('/Home');
      }
    })
  }
}
</script>

<style scoped lang="scss">

.flex_img_catch {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-flow: row-reverse;
}

.catch {
  width: 50%;
}

.img_style {
  width: 50%;
}

.signin_btn_p {
  margin: 50px 0 0;

  .signin_btn {
    text-decoration: none;
    color: white;
    padding: 15px 30px 15px;
    font-size: 30px;
    background: #009688;
    border-radius: 5px;
    letter-spacing: 2px;
    font-weight: bold;

    &:hover {
      opacity: 0.7;
    }
  }

}

@media screen and (max-width: 1264px) {
  .flex_img_catch {
    display: block;
  }

  .catch {
    text-align: center;
    width: 100%;

  }

  .img_style {
    margin: 0 auto;
  }
}

@media screen and (max-width: 600px) {
  .flex_img_catch {
    display: block;
  }

  .catch {
    width: 100%;
    text-align: center;

    h1 {
      font-size: 20px;
    }

    p {
      font-size: 12px;
    }
  }

  .img_style {
    width: 100%;
    text-align: center;
  }
}

.confirm_thisapp {
  margin: 20px 0 0;
}

</style>