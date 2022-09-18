import { createApp } from 'vue';
import router from '@/router';
import store from '@/store';
import firebase from 'firebase';
import firebaseConfig from '@/config/firebase';
import FontAwesome from '@/plugins/FontAwesome'
import './style.css';
import App from './App.vue';
import components from '@/components/index';

firebase.initializeApp(firebaseConfig.firebaseConfig);
firebase.auth().onAuthStateChanged(user => {
	if (user) {
		store.dispatch('fetchAuthUser');
	}
});

const forumApp = createApp(App);

components.forEach(c => {
	forumApp.component(c.name, c.component);
});

forumApp.use(router);
forumApp.use(store);
forumApp.use(FontAwesome)
forumApp.mount('#app');
