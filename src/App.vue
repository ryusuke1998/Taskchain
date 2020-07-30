<template>
<v-app>
<div id="allNav" class="zdirection" style="">
  <v-app-bar fixed flat app height="50px" class="v_app_bar_style">
    <v-app-bar-nav-icon v-if="statusNavIcon" @click="closeOrOpenNavDrawer = true"></v-app-bar-nav-icon>
    <v-toolbar-title v-if="statusNavIcon" style="color: #009688; letter-spacing:1px;" class="mt-1 logo_font font-weight-bold text-h1">TaskChain</v-toolbar-title>
    <v-tooltip bottom>
      <template v-slot:activator="{on, attrs}">
    <v-btn style="margin-right: 30px;" v-on="on" v-bind="attrs"  id="signOut" @click="dialogToSignOut = !dialogToSignOut" icon right fixed large color="teal"><v-icon>mdi-exit-run</v-icon> </v-btn>
      </template>
    <span>sign out</span>
    </v-tooltip>
    <v-dialog v-model="dialogToSignOut" width="300">
      <v-card>
        <v-card-title class="headline teal white--text">sign out?</v-card-title>
        <v-card-actions class="d-flex justify-end">
        <v-btn @click="runSignOut" text color="primary">YES</v-btn>
        <v-btn @click="dialogToSignOut = false" text color="primary">NO</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
        <v-dialog v-model="dialogOfNewUsername" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn style="margin-right: -10px;" icon fixed right large color="teal" v-bind="attrs" v-on="on"><v-icon>mdi-rename-box</v-icon></v-btn>
      </template>
      <v-card>
        <v-card-title class="headline teal white--text">change your name</v-card-title>
        <v-form>
            <v-text-field v-model="newUsername" label="new your name" class="mx-3"></v-text-field>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="saveNewUsername" :disabled="didntWrite">save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
    <v-navigation-drawer color="teal" class="" id="navDrawer" v-if="statusNavDrawer" app>
          <h1 class="text-center my-10 white--text logo_style">TaskChain</h1>
          <div id="appnav">
          <v-btn to="/Home" style="color: #F5F5F5;" active-class="white--text" class="my-4 ml-2 title font-weight-regular" text><v-icon medium class="mr-3">mdi-home-outline</v-icon>Home</v-btn>
          <v-btn to="/Mypage" style="color: #F5F5F5;" active-class="white--text" class="my-4 ml-2 title font-weight-regular" text><v-icon medium class="mr-3">mdi-account-details-outline</v-icon>My Task</v-btn>
          <v-btn to="/Completedtask" style="color: #F5F5F5;" active-class="white--text" class="my-4 ml-2 title font-weight-regular" text><v-icon medium class="mr-3">mdi-playlist-check</v-icon>completed task</v-btn>
          </div>
    </v-navigation-drawer>
    <v-navigation-drawer color="teal" class="" v-if="statusSecondNavDrawer" v-model="closeOrOpenNavDrawer" app>
          <h1 class="text-center my-10 white--text logo_style">TaskChain</h1>
          <div id="appnav">
          <v-btn to="/Home" style="color: #F5F5F5;" active-class="white--text" class="my-4 ml-2 title font-weight-regular" text><v-icon medium class="mr-3">mdi-home</v-icon>Home</v-btn>
          <v-btn to="/Mypage" style="color: #F5F5F5;" active-class="white--text" class="my-4 ml-2 title font-weight-regular" text><v-icon medium class="mr-3">mdi-account-details</v-icon>My Task</v-btn>
          <v-btn to="/Completedtask" style="color: #F5F5F5;" active-class="white--text" class="my-4 ml-2 title font-weight-regular" text><v-icon medium class="mr-3">mdi-playlist-check</v-icon>completed task</v-btn>
          </div>
    </v-navigation-drawer>
</div>
<v-app-bar style="z-index:99; background: #F5F5F5;" flat v-if="initialAppBar">
  <v-toolbar-title class="font-weight-bold welcome_title"><a href="/" class="welcome_toolbar_title_a">TaskChain</a></v-toolbar-title>
  <v-btn class="welcome_signin white--text" depressed color="teal" to="/Signin" fixed right large>Signin</v-btn>
</v-app-bar>
  <v-content class="" style="background: #F5F5F5;">
    <v-container fluid class="">
    <router-view></router-view>
    </v-container>
  </v-content>
</v-app>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'App',

  components: {

  },

  data: () => ({
    closeOrOpenNavDrawer: false,
    dialogOfNewUsername: false,
    newUsername: "",
    dialogToSignOut: false,
    trueOrFalse: false,
  }),
  created() {
        firebase.auth().onAuthStateChanged((user) => {
          this.user = user ? user : {}
          let allNav = document.getElementById('allNav');
          if(user){
            allNav.classList.remove("d-none");
            allNav.classList.remove('zdirection');
          }else{
            allNav.classList.add("d-none");
          }
    });
  },
  computed: {
    statusNavIcon() {
      if(this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.md || this.$vuetify.breakpoint.xs) {
        return true;
      }else {
        return false;
      }
    },
    statusNavDrawer() {
      if(this.$vuetify.breakpoint.xl && this.$route.path != '/') {
        return true;
      }else if(this.$vuetify.breakpoint.lg && this.$route.path != '/') {
        return true;
      }else {
        return true;
      }
    },
    statusSecondNavDrawer() {
      if(this.$vuetify.breakpoint.xl || this.$vuetify.breakpoint.lg) {
        return false;
      }else {
        return true;
      }
    },
    didntWrite() {
      if(this.newUsername === '') {
        return true;
      }else {
        return false;
      }
    },
    initialAppBar() {
      firebase.auth().onAuthStateChanged((user) => {
        if(user) {
          this.trueOrFalse = false;
        }else {
          this.trueOrFalse = true;
        }
      });
      return this.trueOrFalse;
    }
  },
  methods: {
    runSignOut() {
      this.dialogToSignOut = false;
      firebase.auth().signOut().then(() => {
        this.$router.push('/');
      }).catch((error) => {
        alert(error);
      });
    },
    saveNewUsername() {
      let user = firebase.auth().currentUser;
      user.updateProfile({
          displayName: this.newUsername,
        }).then( () => {
        }).catch( (error) => {
            alert(error);
      });
        this.dialogOfNewUsername = false;
        this.newUsername = '';
    },
  }
};
</script>

<style scoped lang="scss">

.app_img  {
  width: 100%;
}

.content_style {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  color: #F5F5F5;
}

.logo_style {
  font-family: 'Gotham-Medium';
  font-size: 30px;
  letter-spacing: 2px;
}

.v_app_bar_style {
  background: #000;
}

.zdirection {
  z-index: -5;
}

.welcome_title {
  margin-top: 40px;
  margin-left: 48px;
}

.welcome_toolbar_title_a {
  color: #009688; 
  text-decoration: none; 
  font-size:40px;
  letter-spacing: 2px;

  &:hover {
    opacity: 0.8;
  }
}

.welcome_signin {
  margin-top: 20px;
  margin-right: 48px;
}


@media screen and (max-width: 600px) {

  .welcome_title {
    margin: 60px auto 0px;
  }

  .welcome_signin {
    display: none;
  }
}

</style>
