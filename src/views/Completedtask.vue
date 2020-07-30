<template>
  <div>
      <v-row>
          <v-col :cols="gridNumber" v-for="(item, index) in localCompletedTasks" :key="index">
              <v-card width="auto" height="auto" class="completedcard" style="position: relative; border-radius: 20px;">
                <div class="" style="background: white;">
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
                <v-card-text @click="pushTaskDialog(index)" style="height: 130px;">
                <p style="height: 110px; overflow:hidden; white-space: pre-wrap;">{{item.message | ellipsis}}</p>
                </v-card-text>
                <div class="d-flex align-center">
                <p class="my-1 ml-3 mr-1">{{item.finishedAt}}</p>
                <v-btn class="mb-1 mx-3 good_btn" icon large @click="countGoodBtn($event, index)" :disabled="isProccessing"><v-icon>mdi-thumb-up</v-icon></v-btn>
                <p class="grey--text my-1 count_goods">{{item.goodCounts}}</p>
                <v-btn class="px-2" @click="openResultTask(index)" outlined absolute right bottom small color="pink" v-if="true">result</v-btn>
                </div>
                </div>
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
      <v-dialog class="" v-model="taskDialog" width="600px">
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
      </v-card>
    </v-dialog>
    <v-dialog v-model="imageDialog" fullscreen hide-overlay>
        <v-card tile>
            <v-toolbar dark flat color="teal" width="100%">
                <v-btn icon @click="closeImageDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>TASK RESULT</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-card width="300px" class="my-3" v-for="(image, index) in localImages" :key="index">
                    <v-img width="300px" :src="image">
                      <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                      </v-row>
                      </template>
                    </v-img>
                </v-card>
            </v-card-text>
        </v-card>
    </v-dialog>
  </div>
</template>

<script>

import firebase from 'firebase'

export default {
    name: "Completedtask",
    data() {
        return {
            localCompletedTasks: [],
            snackbarOfDeleting: false,
            taskDialog: false,
            taskDialogAvatorHeadWord: "",
            taskDialogUsername: "",
            taskDialogTitle: "",
            taskDialogMessage: "",
            taskDialogChips: [],
            imageDialog: false,
            localImages: [],
            isProccessing: false,
        }
    },
    created() {
        firebase.auth().onAuthStateChanged((user) => {
        this.user = user ? user : {}
        if(user){
          firebase.database().ref('completedTasks').limitToLast(300).on('child_added', this.childAdded);
          firebase.database().ref('completedTasks').limitToLast(300).once('value', this.getColorAndBlueText);
        }else{
          firebase.database().ref('completedTasks').limitToLast(300).off('child_added', this.childAdded);
          firebase.database().ref('completedTasks').limitToLast(300).off('value', this.getColorAndBlueText);
            this.$router.push('/');
        }
        });
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
    computed: {
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
        getColorAndBlueText() {
      let vm = this;
      this.$nextTick(() => {
      let classToGiveColors = document.getElementsByClassName('completedcard');
      let goodBtns = document.getElementsByClassName('good_btn');
      let user_id = firebase.auth().currentUser.uid;
        vm.localCompletedTasks.forEach((value, index) => {
          if(value.goodCounts >= 3) {
            classToGiveColors[index].classList.add('card_special_style');
          }else {
            classToGiveColors[index].classList.remove('card_special_style');
          }
          if(value.goodClickedOrDidnt[user_id] === 1) {
            goodBtns[index].classList.add('blue--text');
          }else {
            goodBtns[index].classList.remove('blue--text');
          }
        })
      });
        },
        childAdded(completedTaskItem) {
            const dbCompletedTasks = completedTaskItem.val();
            if(firebase.auth().currentUser.uid === dbCompletedTasks.uid) {
                dbCompletedTasks.myTaskOrNot = true;
            }else {
                dbCompletedTasks.myTaskOrNot = false;
            }
            
                  this.localCompletedTasks.push({
                    username: dbCompletedTasks.username,
                    avatarHeadWord: dbCompletedTasks.username.slice(0, 1).toUpperCase(),
                    myTaskOrNot: dbCompletedTasks.myTaskOrNot,
                    title: dbCompletedTasks.title,
                    message: dbCompletedTasks.message,
                    key: completedTaskItem.key,
                    finishedAt: dbCompletedTasks.finishedAt,
                    imageDatas: dbCompletedTasks.imageDatas,
                    goodOrNot: dbCompletedTasks.goodOrNot,
                    timestamp: dbCompletedTasks.timestamp,
                    goodCounts: dbCompletedTasks.goodCounts,
                    goodClickedOrDidnt: dbCompletedTasks.goodClickedOrDidnt,
                });
              this.localCompletedTasks.sort(
              function(a,b){
                return (a.timestamp < b.timestamp ? 1 : -1);
              });
        },

        deleteOption(index) {
            this.snackbarOfDeleting = true;
            this.indexForDelete = index;
        },
        deleteTask() {
            let completedTaskKeyForDelete = this.localCompletedTasks[this.indexForDelete].key;
            firebase.database().ref('completedTasks').child(completedTaskKeyForDelete).remove();
            this.localCompletedTasks.splice(this.indexForDelete, 1);
            this.snackbarOfDeleting = false;
            this.indexForDelete = 0;
        },
        pushTaskDialog(index) {
            this.taskDialog = true;
            let tasks = this.localCompletedTasks[index];
            this.taskDialogUsername = tasks.username;
            this.taskDialogAvatorHeadWord = tasks.avatarHeadWord;
            this.taskDialogTitle = tasks.title;
            this.taskDialogMessage = tasks.message;
        },
        openResultTask(index) {
            this.imageDialog = true;
            let indexForResult = index;
            let imagesLength = this.localCompletedTasks[indexForResult].imageDatas.length;
            for(let i = 0 ; imagesLength >= i  ; i++) {
                this.localImages.push(this.localCompletedTasks[indexForResult].imageDatas[i]);
            }
            indexForResult = 0;
        },
        closeImageDialog() {
            this.imageDialog = false;
            this.localImages = [];
        },
        countGoodBtn($event, index) {
          let vm = this;
          let user_id = firebase.auth().currentUser.uid;
          let refGoodOrDidnt = firebase.database().ref('completedTasks');
          let clickedKey = vm.localCompletedTasks[index].key;
          let value;
          let goodBtns = document.getElementsByClassName('good_btn');
          let completedCard = document.getElementsByClassName('completedcard');
            if(goodBtns[index].classList.contains('blue--text')) {
              vm.localCompletedTasks[index].goodCounts -= 1;
              value = 0;
              goodBtns[index].classList.remove('blue--text');
            let updates = {};
            updates['/completedTasks/' + clickedKey + '/goodClickedOrDidnt/' + user_id] = value;
            firebase.database().ref().update(updates);

            refGoodOrDidnt.once('value', (snapshot) => {
            let changedValue = snapshot.child(clickedKey).child('goodCounts').val();
            let updates = {}
              updates['/completedTasks/' + clickedKey + '/goodCounts'] = changedValue - 1;
              firebase.database().ref().update(updates);
          });

            }else {
              vm.localCompletedTasks[index].goodCounts += 1;
              goodBtns[index].classList.add("blue--text");
              value = 1;
            let updates = {};
            updates['/completedTasks/' + clickedKey + '/goodClickedOrDidnt/' + user_id] = value;
            firebase.database().ref().update(updates);

            refGoodOrDidnt.once('value', (snapshot) => {
              let changedValue = snapshot.child(clickedKey).child('goodCounts').val();
            let updates = {}
              updates['/completedTasks/' + clickedKey + '/goodCounts'] = changedValue + 1;
              firebase.database().ref().update(updates);
          });
            }
              if(vm.localCompletedTasks[index].goodCounts >= 3) {
                completedCard[index].classList.add('card_special_style');
              }else {
                completedCard[index].classList.remove('card_special_style');
              }
        }
    }
}
</script>

<style lang="scss" scoped>

.card_special_style {
  border-radius: 20px;
  padding: 5px;
  background: linear-gradient(to top right, #f00 0%, #f80 14.28%, #dd0 28.56%, #0d0 42.85%, #0dd 57.14%, #00f 71.42%, #e0e 100%) 0% center / 100% auto;
}

@keyframes card_special_style {
  to { background-position-x: 200%; }
}

</style>