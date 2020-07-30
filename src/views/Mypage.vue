<template>
<div>
  <v-row>
  <v-col class="" :cols="gridNumber" v-for="(item, index) in localMessages" :key="index">
    <v-card width="auto" height="310px" style="position: relative; border-radius: 20px;">
      <v-card-subtitle class="d-flex align-center text-truncate">
        <v-avatar size="35px" class="mr-3 white--text" color="teal">
          {{item.avatarHeadWord}}
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
      <v-btn @click="openCheckMyTask(index)" color="teal" outlined absolute right bottom small v-if="item.myTaskOrNot">check</v-btn>
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
    <v-dialog v-model="checkMyTask" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark style="position: relative;" flat color="teal">
                <v-btn icon dark @click="closeDialogForCheckedTask">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-btn class="my-5 mx-auto d-block" outlined color="teal" width="80%" @click="finishToUploadImage" :disabled="finishUploadImageOrDidnt">タスクを完了する</v-btn>
                <p>タスクの成果を画像として記録しましょう！</p>
                <v-file-input :loading="displayLoading" color="teal" accept="image/*" ref="file" type="file" @change="upImgFile" multiple label="File input" prepend-icon="mdi-camera" v-if="thisIsInputSpace"></v-file-input>
                <v-btn outlined @click="resetImage">画像をリセットする</v-btn>
                <div>
                <v-card class="my-5" max-width="300px" v-for="(image, index) in URLDatas" :key="index">
                    <v-img :src="image">
                      <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="teal lighten-5"></v-progress-circular>
                      </v-row>
                      </template>
                    </v-img>
                </v-card>
                </div>
            </v-card-text>
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
  <v-combobox v-model="localChips" :items="chipItems" chips clearable label="Tag" multiple solo>
    <template v-slot:selection="{item}">
      <v-chip close @click:close="remove(item)">
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
import Compressor from 'compressorjs'

export default {
  name: "Mypage",
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
      checkMyTask: false,
      imgNameForUpload: "",
      imgURLForUpload: "",
      imgFileForUpload: "",
      URLDatas: [],
      thisIsInputSpace: true,
      newImage: '',
      ageOrDidnt: false,
      URLDatasLength: 0,
      displayLoading: false,
    }
  },
  filters: {
    ellipsis(values){
        if (!values) return '';
        if (values.length > 80) {
            return values.slice(0,80) + '...'
        }
        return values;
      }
    },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user ? user : {}
      if(user){
        firebase.database().ref('messages').orderByChild('-timestamp').limitToLast(100).on('child_added', this.childAdded)
      }else{
        firebase.database().ref('messages').orderByChild('-timestamp').limitToLast(100).off('child_added', this.childAdded);
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
    finishUploadImageOrDidnt() {
      if(this.URLDatas.length === this.URLDatasLength) {
        if(this.URLDatas.length === 0) {
          return true;
        } else {
          return false;
        }
      }else {
        return true;
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
        this.localMessages.push({
        username: dbMessages.username,
        avatarHeadWord: dbMessages.username.slice(0, 1).toUpperCase(),
        chips: dbMessages.chips,
        myTaskOrNot: dbMessages.myTaskOrNot,
        title: dbMessages.title,
        message: dbMessages.message,
        messageKey: messageItem.key,
        pushedAt: dbMessages.pushedAt,
        uid: dbMessages.uid,
        imagesForUpload: [],
        timestamp: dbMessages.timestamp,
      });
        }else {
        dbMessages.myTaskOrNot = false;
      }
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
    },

    openCheckMyTask(index) {
        this.checkMyTask = true;
        this.indexForCheckMyTask = index;
    },

    closeDialogForCheckedTask() {
      this.checkMyTask = false;
      this.URLDatasLength = '';
      this.URLDatas = [];
      this.thisIsInputSpace = false;
      this.$nextTick(function () {
        this.thisIsInputSpace = true
      })
    },

    upImgFile(e) {
        let data = e;
        let vm = this;
        this.URLDatasLength = this.URLDatasLength + data.length;
        console.log(this.URLDatasLength);
        const timeValue = new Date().getTime().toString(16);
        for(let i = 0 ; data.length > i ; i++){
          vm.displayLoading = true;
          new Compressor(data[i],{
          quality: 0.6,
          success(result) {
            console.log(result);
            let destination = firebase.storage().ref().child(`images/${timeValue}${i}`);
            destination.put(result).then((snapshot) => {
              console.log('successed to upload');
              snapshot.ref.getDownloadURL().then((url) => {
                console.log("success");
                console.log(url);
                vm.URLDatas.push(url);
                console.log(vm.URLDatas);
                vm.displayLoading = false;
              });
            })
          },
          maxWidth: 1000,
          maxHeight: 400,
          mimeType: 'image/png',
          error(err) {
            console.log(err);
          }
          
        })
        }
    },

    finishToUploadImage() {
        let vm = this;
        let newDate = new Date();
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let day = newDate.getDate();
        let hour = ("0" + newDate.getHours()).slice(-2);
        let minute = ("0" + newDate.getMinutes()).slice(-2);
        let todayAndtime = `${year}/${month}/${day} ${hour}:${minute}`;
        let localMessagesContent = this.localMessages[this.indexForCheckMyTask];
        let usernameWhenCheckMyTask = localMessagesContent.username;
        let titleWhenCheckMyTask = localMessagesContent.title;
        let messageWhenCheckMyTask = localMessagesContent.message;
        let avatarHeadWordWhenCheckMyTask = localMessagesContent.avatarHeadWord;
        let myTaskOrNotWhenCheckMyTask = localMessagesContent.myTaskOrNot;
        let uidWhenCheckMyTask = localMessagesContent.uid;
        let keyWhenCheckMyTask = localMessagesContent.messageKey;
        console.log(usernameWhenCheckMyTask);
        console.log(titleWhenCheckMyTask);
        firebase.database().ref('completedTasks').push({
            username: usernameWhenCheckMyTask,
            title: titleWhenCheckMyTask,
            message: messageWhenCheckMyTask,
            avatarHeadWord: avatarHeadWordWhenCheckMyTask,
            imageDatas: vm.URLDatas,
            finishedAt: todayAndtime,
            myTaskOrNot: myTaskOrNotWhenCheckMyTask,
            uid: uidWhenCheckMyTask,
            timestamp:  firebase.database.ServerValue.TIMESTAMP,
            key: keyWhenCheckMyTask,
            goodCounts: 0,
            goodClickedOrDidnt: {
              uidWhenCheckMyTask: 0,
            },
        });
        console.log(localMessagesContent.chips);
        this.checkMyTask = false;
        this.thisIsInputSpace = false;
        this.$nextTick(function () {
          this.thisIsInputSpace = true;
        })
        let messageKeyForDelete = this.localMessages[this.indexForCheckMyTask].messageKey;
        firebase.database().ref('messages').child(messageKeyForDelete).remove();
        this.localMessages.splice(this.indexForCheckMyTask, 1);
        this.indexForCheckMyTask = 0;
        this.URLDatas = [];
        this.URLDatasLength = '';
    },

    resetImage() {
        this.thisIsInputSpace = false;
        this.$nextTick(function () {
            this.thisIsInputSpace = true
        })
        this.URLDatasLength = '';
        this.URLDatas = [];
        this.displayLoading = false;
    }
  }
}
</script>

<style scope>

  .bd {
    border: 1px solid silver;
  }

</style>