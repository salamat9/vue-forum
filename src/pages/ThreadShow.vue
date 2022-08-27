<script setup>
import { computed, ref } from 'vue';
import sourceData from '@/data.json';
import PostList from '@/components/PostList';
import PostEditor from '@/components/PostEditor';

const props = defineProps({
	id: {
		required: true,
		type: String,
	},
});

const threads = ref(sourceData.threads);
const posts = ref(sourceData.posts);
const users = ref(sourceData.users);
const newPostText = ref(null);

const thread = computed(() => {
	return threads.value.find(thread => thread.id === props.id);
});

const threadPosts = computed(() => {
	return posts.value.filter(post => post.threadId === props.id);
});

const addPost = eventData => {
	console.log(eventData);
	const post = {
		...eventData.post,
		threadId: props.id,
	};
	posts.value.push(post);
	thread.value.posts.push(post);
};
</script>

<template>
	<div class="col-large push-top">
		<h1>{{ thread.title }}</h1>
		<PostList :posts="threadPosts" />
		<PostEditor @save="addPost" />
	</div>
</template>
