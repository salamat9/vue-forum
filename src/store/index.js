import { createStore } from 'vuex';
import sourceData from '@/data.json';
import { findById, upsert } from '@/helpers';

export default createStore({
	state: {
		...sourceData,
		authId: 'u4r8XCziZEWEXsj2UIKNHBoDh0n2',
	},
	getters: {
		authUser: (state, getters) => {
			return getters.user(state.authId)
		},
		user: state => {
			return id => {
				const user = findById(state.users, id);
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
			};
		},
		thread: state => {
			return id => {
				const thread = findById(state.threads, id);
				return {
					...thread,
					get author() {
						return findById(state.users, thread.userId);
					},
					get repliesCount() {
						return thread.posts.length - 1;
					},
					get contributorsCount() {
						return thread.contributors?.length ?? 0;
					},
				};
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
				childId: post.id,
				parentId: post.threadId,
			});
			commit('appendContributorToThread', {
				childId: state.authId,
				parentId: post.threadId,
			});
		},
		async createThread({ commit, state, dispatch }, { title, text, forumId }) {
			const id = 'gggg' + Math.random();
			const userId = state.authId;
			const publishedAt = Math.floor(Date.now() / 1000);
			const thread = { forumId, title, publishedAt, userId, id };
			commit('setThread', { thread });
			commit('appendThreadToUser', { parentId: userId, childId: id });
			commit('appendThreadToForum', { parentId: forumId, childId: id });
			dispatch('createPost', { text, threadId: id });
			return findById(state.threads, id);
		},
		async updateThread({ commit, state }, { title, text, id }) {
			const thread = findById(state.threads, id);
			const post = findById(state.posts, thread.posts[0]);
			const newThread = { ...thread, title };
			const newPost = { ...post, text };
			commit('setThread', { thread: newThread });
			commit('setPost', { post: newPost });
			return newThread;
		},
		updateUser(context, user) {
			context.commit('setUser', { user, userId: user.id });
		},
	},
	mutations: {
		setPost(state, { post }) {
			upsert(state.posts, post);
		},
		setThread(state, { thread }) {
			upsert(state.threads, thread);
		},
		setUser(state, { user, userId }) {
			const userIndex = state.users.findIndex(user => user.id === userId);
			state.users[userIndex] = user;
		},
		appendPostToThread: makeAppendChildToParentMutations({
			parent: 'threads',
			child: 'posts',
		}),
		appendThreadToForum: makeAppendChildToParentMutations({
			parent: 'forums',
			child: 'threads',
		}),
		appendThreadToUser: makeAppendChildToParentMutations({
			parent: 'users',
			child: 'threads',
		}),
		appendContributorToThread: makeAppendChildToParentMutations({
			parent: 'thread',
			child: 'contributors',
		}),
	},
});

function makeAppendChildToParentMutations({ parent, child }) {
	return (state, { childId, parentId }) => {
		const resource = findById(state[parent], parentId);
		resource[child] = resource[child] || [];
		if (!resource[child].includes(childId)) {
			resource[child].push(childId);
		}
	};
}