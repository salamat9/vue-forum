<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ThreadEditor from '@/components/ThreadEditor';
import { findById } from '../helpers';

const store = useStore();
const router = useRouter();

const props = defineProps({
	id: {
		required: true,
		type: String,
	},
});

const thread = computed(() => findById(store.state.threads, props.id));

const text = computed(() => {
	const post = findById(store.state.posts, thread._value.posts[0]);
	return post ? post.text : '';
});

const save = async ({ title, text }) => {
	const thread = await store.dispatch('updateThread', {
		id: props.id,
		title,
		text,
	});
	router.push({ name: 'ThreadShow', params: { id: thread.id } });
};

const cancel = () => {
	router.push({ name: 'Forum', params: { id: props.forumId } });
};

onMounted(async () => {
	const thread = await store.dispatch('fetchThread', { id: props.id });
	store.dispatch('fetchPost', { id: thread.posts[0] });
});
</script>

<template>
	<div v-if="thread && text" class="col-full push-top">
		<h1>
			Editing <i>{{ thread.title }}</i>
		</h1>
		<ThreadEditor
			:title="thread.title"
			:text="text"
			@save="save"
			@cancel="cancel"
		/>
	</div>
</template>
