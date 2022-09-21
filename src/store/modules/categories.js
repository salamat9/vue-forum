import firebase from 'firebase';
import { makeFetchItemAction, makeFetchItemsAction } from '@/helpers';

export default {
	namespaced: true,
	state: {
		items: [],
	},
	getters: {},
	actions: {
		fetchCategory: makeFetchItemAction({ resource: 'categories' }),

		fetchCategories: makeFetchItemsAction({ resource: 'categories' }),

		fetchAllCategories({ commit }) {
			return new Promise(resolve => {
				firebase
					.firestore()
					.collection('categories')
					.onSnapshot(querySnapshot => {
						const categories = querySnapshot.docs.map(doc => {
							const item = { id: doc.id, ...doc.data() };
							commit(
								'setItem',
								{ resource: 'categories', item },
								{ root: true }
							);
							return item;
						});
						resolve(categories);
					});
			});
		},
	},
	mutations: {},
};
