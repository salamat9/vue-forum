<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import difference from 'lodash/difference';
import { useAsyncDataStatus } from '@/composables/asyncDataStatus';
import useNotifications from '@/composables/useNotification';
import PostList from '@/components/PostList';
import PostEditor from '@/components/PostEditor';

const store = useStore();
const route = useRoute();

const { addNotification } = useNotifications();

const emit = defineEmits(['ready']);
const props = defineProps({
	id: {
		required: true,
		type: String,
	},
});

const ready = ref(false);
const thread = ref(null);
const newPostText = ref(null);
const authUser = ref(false);

const threads = computed(() => store.state.threads.items);
const posts = computed(() => store.state.posts.items);
const threadPosts = computed(() =>
	posts.value.filter(post => post.threadId === props.id)
);

const addPost = eventData => {
	const post = {
		...eventData.post,
		threadId: props.id,
	};
	store.dispatch('posts/createPost', post);
};

const fetchPostWithUsers = async ids => {
	const posts = await store.dispatch('posts/fetchPosts', {
		ids: ids,
		onSnapshot: ({ isLocal, previousItem }) => {
			if (
				ready.value ||
				isLocal ||
				(previousItem?.edited && !previousItem?.edited?.at)
			)
				return;
			addNotification({ message: 'Thread recently updated', timeout: 5000 });
		},
	});
	const users = posts.map(post => post.userId).concat(thread.value.userId);
	await store.dispatch('users/fetchUsers', { ids: users });
};

onMounted(async () => {
	thread.value = await store.dispatch('threads/fetchThread', {
		id: props.id,
		onSnapshot: ({ isLocal, item, previousItem }) => {
			if (!ready.value || isLocal) return;
			const newPosts = difference(item.posts, previousItem.posts);
			fetchPostWithUsers(newPosts);
			addNotification({ message: 'Thread recently updated', timeout: 5000 });
		},
	});
	thread.value.author = await store.dispatch('users/fetchUser', {
		id: thread.value.userId,
	});
	fetchPostWithUsers(thread.value.posts);
	authUser.value = store.state.auth.user;
	ready.value = useAsyncDataStatus();
	emit('ready');
});
</script>

<template>
	<div v-if="ready" class="col-large push-top">
		<h1>
			{{ thread?.title }}
			<router-link
				v-if="thread.userId === authUser?.id"
				:to="{ name: 'ThreadEdit', id: this.id }"
				class="btn-green btn-small"
				tag="button"
			>
				Edit Thread
			</router-link>
		</h1>
		<p>
			By <a href="#" onclick="return false" class="link-unstyled">{{ thread?.author?.name }}</a
			>, <AppDate v-if="thread" :timestamp="thread?.publishedAt" />.
			<span
				style="float: right; margin-top: 2px"
				class="hide-mobile text-faded text-small"
				>{{ thread?.repliesCount }} replies by
				{{ thread?.contributorsCount }} contributors</span
			>
		</p>
		<PostList :posts="threadPosts" />
		<PostEditor v-if="authUser" @save="addPost" />
		<div v-else class="text-center" style="margin-bottom: 50px">
			<router-link :to="{ name: 'SignIn', query: { redirectTo: route.path } }"
				>SignIn</router-link
			>
			or
			<router-link :to="{ name: 'Register', query: { redirectTo: route.path } }"
				>Register</router-link
			>
			to reply.
		</div>
	</div>
</template>
