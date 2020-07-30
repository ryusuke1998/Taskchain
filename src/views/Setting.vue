<template>
  <div>
    <v-dialog v-model="dialogOfNewUsername" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="d-block my-3" color="teal" text dark v-bind="attrs" v-on="on">ユーザー名を変更する</v-btn>
      </template>
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>ユーザー名の変更</v-card-title>
        <v-form>
            <v-text-field v-model="newUsername" label="新しいユーザー名" class="mx-3"></v-text-field>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="saveNewUsername">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import firebase from 'firebase'

export default {
    name: "Setting",
    data() {
        return {
            dialogOfNewUsername: false,
            newUsername: "",
            dialogOfNewIcon: false,
            imageURL: "",
        }
    },
    methods: {
        saveNewUsername() {
            let user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: this.newUsername,
            }).then( () => {
                alert('ユーザー名の登録ができました！')
            }).catch( (error) => {
                alert(error);
            });
            this.dialogOfNewUsername = false;
        },
    },
}
</script>

<style>

</style>