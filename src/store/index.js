import { createStore } from 'vuex';
import sourceData from '@/data.json';

export default createStore({
	state: {
		...sourceData,
		authId: 'u4r8XCziZEWEXsj2UIKNHBoDh0n2',
	},
	getters: {
		authUser: state => {
			const user = state.users.find(user => user.id == state.authId);
			if (!user) return null;
			return {
				...user,
				get posts() {
					return state.posts.filter(post => post.userId == user.id);
				},
				get postsCount() {
					const count = this.posts.length;
					if (count == 1) return '1 post';
					return `${count} posts`;
				},
				get threads() {
					return state.threads.filter(t => t.userId == user.id);
				},
				get threadsCount() {
					const count = this.threads.length;
					if (count == 1) return '1 thread';
					return `${count} threads`;
				},
			};
		},
	},
	actions: {
		createPost({ commit, state }, post) {
			post.id = 'gggg' + Math.random();
			post.userId = state.authId;
			post.publishedAt = Math.floor(Date.now() / 1000);
			commit('setPost', { post });
			commit('appendPostToThread', {
				postId: post.id,
				threadId: post.threadId,
			});
		},
		updateUser(context, user) {
			context.commit('setUser', { user, userId: user.id });
		},
	},
	mutations: {
		setPost(state, { post }) {
			state.posts.push(post);
		},
		setUser(state, { user, userId }) {
			const userIndex = state.users.findIndex(user => user.id === userId);
			state.users[userIndex] = user;
		},
		appendPostToThread(state, { postId, threadId }) {
			const thread = state.threads.find(t => t.id == threadId);
			thread.posts.push(postId);
		},
	},
});
