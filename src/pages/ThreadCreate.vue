<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useAsyncDataStatus } from '@/composables/asyncDataStatus';
import { findById } from '@/helpers';
import ThreadEditor from '@/components/ThreadEditor';

const store = useStore();
const router = useRouter();

const emit = defineEmits(['ready'])
const props = defineProps({
	forumId: {
		required: true,
		type: String,
	},
});

const ready = ref(false)

const forum = computed(() => findById(store.state.forums, props.forumId));

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

onMounted(async () => {
	await store.dispatch('fetchForum', { id: props.forumId })
	ready.value = useAsyncDataStatus()
	emit('ready')
})
</script>

<template>
	<div v-if="ready" class="col-full push-top">
		<h1>
			Create new thread in <i>{{ forum.name }}</i>
		</h1>
		<ThreadEditor @save="save" @cancel="cancel" />
	</div>
</template>
