import { createStore } from 'vuex';
import firebase from 'firebase';
import { findById, upsert } from '@/helpers';

export default createStore({
	state: {
		categories: [],
		forums: [],
		threads: [],
		posts: [],
		users: [],
		authId: 'u4r8XCziZEWEXsj2UIKNHBoDh0n2',
	},
	getters: {
		authUser: (state, getters) => {
			return getters.user(state.authId);
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
				if (!thread) return {};
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
			commit('setItem', { resource: 'posts', item: post });
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
			commit('setItem', { resource: 'threads', item: thread });
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
			commit('setItem', { resource: 'threads', item: newThread });
			commit('setItem', { resource: 'posts', item: newPost });
			return newThread;
		},
		updateUser(context, user) {
			context.commit('setItem', { resource: 'users', item: user });
		},
		fetchAllCategories({ commit }) {
			return new Promise(resolve => {
				firebase
					.firestore()
					.collection('categories')
					.onSnapshot(querySnapshot => {
						const categories = querySnapshot.docs.map(doc => {
							const item = { id: doc.id, ...doc.data() };
							commit('setItem', { resource: 'categories', item });
							return item;
						});
						resolve(categories);
					});
			});
		},
		fetchCategory({ dispatch }, { id }) {
			return dispatch('fetchItem', { id, resource: 'categories' });
		},
		fetchForum({ dispatch }, { id }) {
			return dispatch('fetchItem', { id, resource: 'forums' });
		},
		fetchThread({ dispatch }, { id }) {
			return dispatch('fetchItem', { id, resource: 'threads' });
		},
		fetchPost({ dispatch }, { id }) {
			return dispatch('fetchItem', { id, resource: 'posts' });
		},
		fetchUser({ dispatch }, { id }) {
			return dispatch('fetchItem', { id, resource: 'users' });
		},

		fetchThreads({ dispatch }, { ids }) {
			return dispatch('fetchItems', { resource: 'threads', ids });
		},
		fetchForums({ dispatch }, { ids }) {
			return dispatch('fetchItems', { resource: 'forums', ids });
		},
		fetchPosts({ dispatch }, { ids }) {
			return dispatch('fetchItems', { resource: 'posts', ids });
		},
		fetchUsers({ dispatch }, { ids }) {
			return dispatch('fetchItems', { resource: 'users', ids });
		},
		fetchItems({ dispatch }, { ids, resource }) {
			return Promise.all(
				ids.map(id => dispatch('fetchItem', { id, resource }))
			);
		},

		fetchItem({ state, commit }, { id, resource }) {
			return new Promise(resolve => {
				firebase
					.firestore()
					.collection(resource)
					.doc(id)
					.onSnapshot(doc => {
						const item = { ...doc.data(), id: doc.id };
						commit('setItem', { resource, id, item });
						resolve(item);
					});
			});
		},
	},
	mutations: {
		setItem(state, { resource, item }) {
			upsert(state[resource], item);
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
		if (!resource) {
			console.warn(
				`Appending ${child} ${childId} to ${parent} ${parentId} failed because the parent didn't exist`
			);
			return;
		}
		resource[child] = resource[child] || [];

		if (!resource[child].includes(childId)) {
			resource[child].push(childId);
		}
	};
}
