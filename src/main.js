import { createApp } from 'vue';
import router from '@/router';
import './style.css';
import App from './App.vue';
import components from '@/components/index';

const forumApp = createApp(App);

components.forEach(c => {
	forumApp.component(c.name, c.component);
});
forumApp.use(router);
forumApp.mount('#app');
