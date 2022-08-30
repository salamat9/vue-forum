<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ThreadEditor from '@/components/ThreadEditor';

const store = useStore();
const router = useRouter();

const props = defineProps({
	id: {
		required: true,
		type: String,
	},
});

const thread = computed(() => store.state.threads.find(t => t.id === props.id));

const text = computed(() => {
	return store.state.posts.find(p => p.id === thread._value.posts[0]).text;
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
</script>

<template>
	<div class="col-full push-top">
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
