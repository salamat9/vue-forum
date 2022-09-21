<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { useAsyncDataStatus } from '@/composables/asyncDataStatus';
import ThreadEditor from '@/components/ThreadEditor';
import { findById } from '@/helpers';

const store = useStore();
const router = useRouter();

const emit = defineEmits(['ready'])
const props = defineProps({
	id: {
		required: true,
		type: String,
	},
});

const ready = ref(false)
const formIsDirty = ref(false)

const thread = computed(() => findById(store.state.threads.items, props.id));

const text = computed(() => {
	const post = findById(store.state.posts.items, thread._value.posts[0]);
	return post ? post.text : '';
});

const save = async ({ title, text }) => {
	const thread = await store.dispatch('threads/updateThread', {
		id: props.id,
		title,
		text,
	});
	router.push({ name: 'ThreadShow', params: { id: thread.id } });
};

const cancel = () => {
	router.push({ name: 'ThreadShow', params: { id: props.id } });
};

onBeforeRouteLeave(() => {
	if (formIsDirty.value) {
		const confirmed = window.confirm(
			'Are you sure you want to leave? Unsaved changes will be lost!'
		);
		if (!confirmed) return false;
	}
});

onMounted(async () => {
	const thread = await store.dispatch('threads/fetchThread', { id: props.id });
	await store.dispatch('posts/fetchPost', { id: thread.posts[0] });
	ready.value = useAsyncDataStatus()
	emit('ready')
});
</script>

<template>
	<div v-if="ready" class="col-full push-top">
		<h1>
			Editing <i>{{ thread.title }}</i>
		</h1>
		<ThreadEditor
			:title="thread.title"
			:text="text"
			@save="save"
			@cancel="cancel"
			@dirty="formIsDirty = true"
			@clean="formIsDirty = false"
		/>
	</div>
</template>
