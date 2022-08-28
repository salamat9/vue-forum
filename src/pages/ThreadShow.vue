<script setup>
import { computed, ref } from 'vue';
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
const posts = computed(() => store.state.posts)

const thread = computed(() =>
	threads.value.find(thread => thread.id === props.id)
);

const threadPosts = computed(() =>
	posts.value.filter(post => post.threadId === props.id)
);

const addPost = eventData => {
	const post = {
		...eventData.post,
		threadId: props.id,
	};
	store.dispatch('createPost', post)
};
</script>

<template>
	<div class="col-large push-top">
		<h1>{{ thread.title }}</h1>
		<PostList :posts="threadPosts" />
		<PostEditor @save="addPost" />
	</div>
</template>
