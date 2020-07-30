<template>
<div>
  <v-row>
  <v-col :cols="gridNumber" v-for="(item, index) in localMessages" :key="index">
    <v-card class="cardstyle" width="auto" height="310px" style="position: relative; border-radius: 20px;">
      <v-card-subtitle class="d-flex align-center text-truncate">
        <v-avatar size="35px" class="mr-3 white--text" color="teal">
          <p class="mt-4">{{item.avatarHeadWord}}</p>
        </v-avatar>
        {{item.username}}
      <v-btn text icon absolute right v-if="item.myTaskOrNot" @click="deleteOption(index)">
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
      </v-card-subtitle>
      <v-card-title @click="pushTaskDialog(index)" class="text-truncate d-block" style="max-width: 300px;">
        {{item.title}}
      </v-card-title>
      <v-divider class="mx-2"></v-divider>
      <v-card-text @click="pushTaskDialog(index)" class="" style="height: 130px;">
        <p style="height: 110px; white-space: pre-wrap; overflow:hidden;">{{item.message | ellipsis}}</p>
      </v-card-text>
      <p class="my-1 ml-3 mr-1">{{item.pushedAt}}</p>
    </v-card>
  </v-col>
  </v-row>
    <v-snackbar v-model="snackbarOfDeleting">
      Delete task?
      <div class="d-flex justify-right">
      <v-btn color="pink" text @click="deleteTask">
        yes
      </v-btn>
      <v-btn color="pink" text @click="snackbarOfDeleting = false">
        No
      </v-btn>
      </div>
    </v-snackbar>
      <v-dialog v-model="taskDialog" width="600px">
      <v-card class="pa-3" style="">
        <v-card-subtitle class="d-flex align-center">
          <v-avatar class="mr-3 white--text" size="35px" color="teal">
            {{taskDialogAvatorHeadWord}}
          </v-avatar>
          {{taskDialogUsername}}
        </v-card-subtitle>
        <v-card-title>
          {{taskDialogTitle}}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-5">
          <p style="white-space: pre-wrap;">{{taskDialogMessage}}</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-chip-group>
          <v-chip v-for="chip in taskDialogChips" :key="chip">
            {{chip}}
          </v-chip>
        </v-chip-group>
      </v-card>
    </v-dialog>
  <div class="text-center">
    <v-btn color="teal" dark @click="formDialog = true" fab large bottom right fixed ><v-icon dark>mdi-pencil</v-icon></v-btn>
    <v-dialog v-model="formDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">TASK CONTENT</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent>
          <v-text-field filled class="" label="title" v-model="localTitle"></v-text-field>
          <v-textarea height="300px" filled label="task content" class="" v-model="localMessage"></v-textarea>    
          </v-form>
  <v-combobox
    v-model="localChips"
    :items="chipItems"
    chips
    clearable
    label="Tag"
    multiple
    solo
  >
    <template v-slot:selection="{item}">
      <v-chip
        close
        @click:close="remove(item)"
      >
        <strong>{{ item }}</strong>
      </v-chip>
    </template>
  </v-combobox>
          <small>時間を決めましょう！</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="formDialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="sendMessage" :disabled="areThereString">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</div>
</template>

<script>

import firebase from 'firebase'

export default {
  name: "Home",
  data(){
    return {
      displayUsername: "",
      localTitle: "",
      localMessage: "",
      user: {},
      localUsename: "",
      localMessages: [],
      taskDialogUsername: "",
      taskDialogTitle: "",
      taskDialogMessage: "",
      taskDialogAvatorHeadWord: "",
      taskDialogChips: [],
      formDialog: false,
      taskDialog: false,
      localChips: [],
      chipItems: ["勉強", "仕事", "家事", "休日"],
      avatarHeadWord: '',
      snackbarOfDeleting: false,
      firebaseMessageId: 0,
    }
  },
  filters: {
    ellipsis(value){
        if (!value) return '';
        if (value.length > 80) {
          return value.slice(0,80) + '...'
        }
        return value
      }
    },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user ? user : {}
      if(user){
        firebase.database().ref('messages').orderByChild('-timestamp').on('child_added', this.childAdded)
      }else{
        firebase.database().ref('messages').orderByChild('-timestamp').off('child_added', this.childAdded);
        this.$router.push('/');
      }
    });
  },
  computed: {
    areThereString() {
      if(this.localTitle === "" || this.localMessage === "") {
        return true;
      }else {
        return false;  
      }
    },
    gridNumber() {
      if(this.$vuetify.breakpoint.xl) {
        return "3"
      }else if(this.$vuetify.breakpoint.lg || this.$vuetify.breakpoint.md) {
        return "4"
      }else if(this.$vuetify.breakpoint.sm) {
        return "6"
      }else {
        return "12"
      }
    },
  },
  methods: {
    sendMessage() {
      let user = firebase.auth().currentUser;
      let newDate = new Date();
      let year = newDate.getFullYear();
      let month = newDate.getMonth() + 1;
      let day = newDate.getDate();
      let hour = ("0" + newDate.getHours()).slice(-2);
      let minute = ("0" + newDate.getMinutes()).slice(-2);
      let todayAndtime = `${year}/${month}/${day} ${hour}:${minute}`;
      firebase.database().ref('messages').push({
        username: user.displayName,
        chips: this.localChips,
        myTaskOrNot: true,
        title: this.localTitle,
        message: this.localMessage,
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        indexForDelete: 0,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        pushedAt: todayAndtime,
      });
      this.localTitle = '';
      this.localMessage = '';
      this.localChips = [];
      this.formDialog = false;
    },

    childAdded(messageItem) {
      const dbMessages = messageItem.val();
      if(firebase.auth().currentUser.uid === dbMessages.uid) {
          dbMessages.myTaskOrNot = true;
        }else {
        dbMessages.myTaskOrNot = false;
      }
      this.localMessages.push({
        username: dbMessages.username,
        avatarHeadWord: dbMessages.username.slice(0, 1).toUpperCase(),
        chips: dbMessages.chips,
        myTaskOrNot: dbMessages.myTaskOrNot,
        title: dbMessages.title,
        message: dbMessages.message,
        messageKey: messageItem.key,
        pushedAt: dbMessages.pushedAt,
        timestamp: dbMessages.timestamp,
      });

      this.localMessages.sort(
      function(a,b){
        return (a.timestamp < b.timestamp ? 1 : -1);
      });
    },
    
    remove(item) {
        this.chips.splice(this.chips.indexOf(item), 1)
        this.chips = [...this.chips]
    },

    pushTaskDialog(index) {
      this.taskDialog = true;
      let tasks = this.localMessages[index];
      this.taskDialogUsername = tasks.username;
      this.taskDialogAvatorHeadWord = tasks.avatarHeadWord;
      this.taskDialogTitle = tasks.title;
      this.taskDialogMessage = tasks.message;
      this.taskDialogChips = tasks.chips;
    },
    deleteOption(index) {
      this.snackbarOfDeleting = true;
      this.indexForDelete = index;
    },
    deleteTask() {
      let messageKeyForDelete = this.localMessages[this.indexForDelete].messageKey;
      firebase.database().ref('messages').child(messageKeyForDelete).remove();
      this.localMessages.splice(this.indexForDelete, 1);
      this.snackbarOfDeleting = false;
      this.indexForDelete = 0;
    }
  }
}
</script>

<style scoped>

.avator_hidden {
  display: none;
}

</style>
