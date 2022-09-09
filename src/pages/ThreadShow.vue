<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import PostList from '@/components/PostList';
import PostEditor from '@/components/PostEditor';

const store = useStore();

const props = defineProps({
	id: {
		required: true,
		type: String,
	},
});

const newPostText = ref(null);

const threads = computed(() => store.state.threads);
const posts = computed(() => store.state.posts);
const thread = ref(null);
const threadPosts = computed(() =>
	posts.value.filter(post => post.threadId === props.id)
);

const addPost = eventData => {
	const post = {
		...eventData.post,
		threadId: props.id,
	};
	store.dispatch('createPost', post);
};

onMounted(async () => {
	thread.value = await store.dispatch('fetchThread', { id: props.id });
	thread.value.author = await store.dispatch('fetchUser', {
		id: thread.value.userId,
	});
	thread.value.posts.forEach(async postId => {
		const post = await store.dispatch('fetchPost', { id: postId });
		store.dispatch('fetchUser', { id: post.userId });
	});
});
</script>

<template>
	<div class="col-large push-top">
		<h1>
			{{ thread?.title }}
			<router-link
				:to="{ name: 'ThreadEdit', id: this.id }"
				class="btn-green btn-small"
				tag="button"
			>
				Edit Thread
			</router-link>
		</h1>
		<p>
			By <a href="#" class="link-unstyled">{{ thread?.author?.name }}</a
			>, <AppDate :timestamp="thread?.publishedAt" />.
			<span
				style="float: right; margin-top: 2px"
				class="hide-mobile text-faded text-small"
				>{{ thread?.repliesCount }} replies by
				{{ thread?.contributorsCount }} contributors</span
			>
		</p>
		<PostList :posts="threadPosts" />
		<PostEditor @save="addPost" />
	</div>
</template>
