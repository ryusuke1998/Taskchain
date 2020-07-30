import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import firebase from 'firebase'

Vue.config.productionTip = false

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCh4faNhfztsVyZQJfwxeRxQJJKc_fJJaU",
    authDomain: "new-check-together.firebaseapp.com",
    databaseURL: "https://new-check-together.firebaseio.com",
    projectId: "new-check-together",
    storageBucket: "new-check-together.appspot.com",
    messagingSenderId: "581117830731",
    appId: "1:581117830731:web:74973f0eabb500d6030fce",
    measurementId: "G-C1Q4MG1M2G"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
