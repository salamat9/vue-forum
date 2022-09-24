import { createApp } from 'vue';
import router from '@/router';
import store from '@/store';
import firebase from '@/helpers/firebase';
import firebaseConfig from '@/config/firebase';
import FontAwesome from '@/plugins/FontAwesome';
import './style.css';
import App from './App.vue';
import components from '@/components/index';
import ClickOutsideDirective from '@/plugins/ClickOutsideDirective';
import PageScrollDirective from '@/plugins/PageScrollDirective';
import Vue3Pagination from '@/plugins/Vue3Pagination';

firebase.initializeApp(firebaseConfig.firebaseConfig);

const forumApp = createApp(App);

components.forEach(c => {
	forumApp.component(c.name, c.component);
});

forumApp.use(router);
forumApp.use(store);
forumApp.use(FontAwesome);
forumApp.use(ClickOutsideDirective);
forumApp.use(PageScrollDirective);
forumApp.use(Vue3Pagination);
forumApp.mount('#app');
