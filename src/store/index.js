import { createStore } from 'vuex';
import getters from '@/store/getters';
import actions from '@/store/actions';
import mutations from '@/store/mutations';

export default createStore({
	state: {
		authId: null,
		user: null,
		authUserUnsubscribe: null,
		authObserverUnsubscribe: null,
		categories: [],
		forums: [],
		threads: [],
		posts: [],
		users: [],
		unsubscribes: [],
	},
	getters,
	actions,
	mutations,
});
