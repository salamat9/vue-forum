<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ThreadEditor from '@/components/ThreadEditor';

const store = useStore();
const router = useRouter();

const props = defineProps({
	forumId: {
		required: true,
		type: String,
	},
});

const forum = computed(() =>
	store.state.forums.find(f => f.id === props.forumId)
);

const save = async ({ title, text }) => {
	const thread = await store.dispatch('createThread', {
		forumId: props.forumId,
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
			Create new thread in <i>{{ forum.name }}</i>
		</h1>
		<ThreadEditor @save="save" @cancel="cancel" />
	</div>
</template>
