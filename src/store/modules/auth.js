import firebase from 'firebase';

export default {
	namespaced: true,
	state: {
		user: null,
		authId: null,
		authUserUnsubscribe: null,
		authObserverUnsubscribe: null,
	},
	getters: {
		authUser: (state, getters, rootState, rootGetters) => {
			return rootGetters['users/user'](state.authId);
		},
	},
	actions: {
		initAuthentication({ dispatch, commit, state }) {
			if (state.authObserverUnsubscribe) state.authObserverUnsubscribe();
			return new Promise(resolve => {
				const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
					this.dispatch('auth/unsubscribeAuthUserSnapshot');
					if (user) {
						await this.dispatch('auth/fetchAuthUser');
						resolve(user);
					} else {
						resolve(null);
					}
				});
				commit('setAuthObserverUnsubscribe', unsubscribe);
			});
		},
		async registerUserWithEmailAndPassword(
			{ dispatch },
			{ avatar = null, email, name, username, password }
		) {
			const result = await firebase
				.auth()
				.createUserWithEmailAndPassword(email, password);
			await dispatch(
				'users/createUser',
				{
					id: result.user.uid,
					email,
					name,
					username,
					avatar,
				},
				{ root: true }
			);
		},
		signInWithEmailAndPassword(context, { email, password }) {
			return firebase.auth().signInWithEmailAndPassword(email, password);
		},
		async signInWithGoogle({ dispatch }) {
			const provider = new firebase.auth.GoogleAuthProvider();
			const response = await firebase.auth().signInWithPopup(provider);
			const user = response.user;
			const userRef = firebase.firestore().collection('users').doc(user.uid);
			const userDoc = await userRef.get();
			if (!userDoc.exists) {
				return dispatch(
					'users/createUser',
					{
						id: user.uid,
						name: user.displayName,
						email: user.email,
						username: user.email,
						avatar: user.photoURL,
					},
					{ root: true }
				);
			}
		},
		async signOut({ commit }) {
			await firebase.auth().signOut();
			commit('setAuthId', null);
		},
		async fetchAuthUsersPosts({ commit, state }, { startAfter }) {
			let query = await firebase
				.firestore()
				.collection('posts')
				.where('userId', '==', state.authId)
				.orderBy('publishedAt', 'desc')
				.limit(10);

			if (startAfter) {
				const doc = await firebase.firestore().collection('posts').doc(startAfter.id).get()
				query = query.startAfter(doc);
			}

			const posts = await query.get();
			posts.forEach(item => {
				commit('setItem', { resource: 'posts', item }, { root: true });
			});
		},
		fetchAuthUser: async ({ dispatch, commit }) => {
			const userId = firebase.auth().currentUser?.uid;
			if (!userId) return;
			await dispatch(
				'fetchItem',
				{
					id: userId,
					resource: 'users',
					handleUnsubscribe: unsubscribe => {
						commit('setAuthUserUnsubscribe', unsubscribe);
					},
				},
				{ root: true }
			);
			firebase
				.firestore()
				.collection('users')
				.doc(userId)
				.onSnapshot(doc => {
					const user = { ...doc.data(), id: doc.id };
					commit('setUser', user);
				});
			commit('setAuthId', userId);
		},
		async unsubscribeAuthUserSnapshot({ state, commit }) {
			if (state.authUserUnsubscribe) {
				state.authUserUnsubscribe();
				commit('setAuthUserUnsubscribe', null);
			}
		},
	},
	mutations: {
		setAuthUserUnsubscribe(state, unsubscribe) {
			state.authUserUnsubscribe = unsubscribe;
		},
		setAuthObserverUnsubscribe(state, unsubscribe) {
			state.authObserverUnsubscribe = unsubscribe;
		},
		setAuthId(state, id) {
			state.authId = id;
		},
		setUser(state, user) {
			state.user = user;
		},
	},
};
