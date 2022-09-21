import firebase from 'firebase';

export default {
	namespaced: true,
	state: {
		items: [],
	},
	getters: {},
	actions: {
		fetchCategory: ({ dispatch }, { id }) =>
			dispatch('fetchItem', { id, resource: 'categories' }, { root: true }),

		fetchCategories: ({ dispatch }, { ids }) =>
			dispatch('fetchItems', { resource: 'categories', ids }, { root: true }),

		fetchAllCategories({ commit }) {
			return new Promise(resolve => {
				firebase
					.firestore()
					.collection('categories')
					.onSnapshot(querySnapshot => {
						const categories = querySnapshot.docs.map(doc => {
							const item = { id: doc.id, ...doc.data() };
							commit('setItem', { resource: 'categories', item }, {root:true});
							return item;
						});
						resolve(categories);
					});
			});
		},
	},
	mutations: {},
};
