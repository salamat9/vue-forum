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
		async createThread({ commit, state, dispatch }, { title, text, forumId }) {
			const id = 'gggg' + Math.random();
			const userId = state.authId;
			const publishedAt = Math.floor(Date.now() / 1000);
			const thread = { forumId, title, publishedAt, userId, id };
			commit('setThread', { thread });
			commit('appendThreadToUser', { userId, threadId: id });
			commit('appendThreadToForum', { forumId, threadId: id });
			dispatch('createPost', { text, threadId: id });
			return state.threads.find(t => t.id == id);
		},
		async updateThread({ commit, state }, { title, text, id }) {
			const thread = state.threads.find(t => t.id === id);
			const post = state.posts.find(p => p.id === thread.posts[0]);
			const newThread = { ...thread, title };
			const newPost = { ...post, text };
			commit('setThread', { thread: newThread });
			commit('setPost', { post: newPost });
			return newThread
		},
		updateUser(context, user) {
			context.commit('setUser', { user, userId: user.id });
		},
	},
	mutations: {
		setPost(state, { post }) {
			const index = state.posts.findIndex(p => p.id === post.id);
			if (post.id && index !== -1) {
				state.posts[index] = post;
			} else {
				state.posts.push(post);
			}
		},
		setThread(state, { thread }) {
			const index = state.threads.findIndex((t => t.id === thread.id));
			if (thread.id && index !== -1) {
				state.threads[index] = thread;
			} else {
				state.threads.push(thread);
			}
		},
		setUser(state, { user, userId }) {
			const userIndex = state.users.findIndex(user => user.id === userId);
			state.users[userIndex] = user;
		},
		appendPostToThread(state, { postId, threadId }) {
			const thread = state.threads.find(t => t.id == threadId);
			thread.posts = thread.posts || [];
			thread.posts.push(postId);
		},
		appendThreadToForum(state, { forumId, threadId }) {
			const forum = state.forums.find(f => f.id == forumId);
			forum.threads = forum.threads || [];
			forum.threads.push(threadId);
		},
		appendThreadToUser(state, { userId, threadId }) {
			const user = state.users.find(u => u.id == userId);
			user.threads = user.threads || [];
			user.threads.push(threadId);
		},
	},
});
