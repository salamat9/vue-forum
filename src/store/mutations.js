import { upsert, findById, docToResource } from '@/helpers';

export default {
	setItem(state, { resource, item }) {
		upsert(state[resource], docToResource(item));
	},

	setUser(state, user) {
		state.user = user;
	},

	setAuthUserUnsubscribe(state, unsubscribe) {
		state.authUserUnsubscribe = unsubscribe;
	},

	setAuthId(state, id) {
		state.authId = id;
	},

	appendUnsubscribe(state, { unsubscribe }) {
		state.unsubscribes.push(unsubscribe);
	},
	clearAllUnsubscribes(state) {
		state.unsubscribes = [];
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
};

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
