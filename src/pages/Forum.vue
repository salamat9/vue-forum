<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useAsyncDataStatus } from '@/composables/asyncDataStatus';
import { findById } from '@/helpers';

const store = useStore();

const emit = defineEmits(['ready'])
const props = defineProps({
	id: {
		required: true,
		type: String,
	},
});

const ready = ref(false)

const forum = computed(() => {
	return findById(store.state.forums, props.id);
});

const threads = computed(() => {
	if (!forum.value) return [];
	return forum._value.threads.map(threadId => store.getters.thread(threadId));
});

onMounted(async () => {
	const forum = await store.dispatch('fetchForum', { id: props.id });
	const threads = await store.dispatch('fetchThreads', { ids: forum.threads });
	await store.dispatch('fetchUsers', { ids: threads.map(thread => thread.userId) });
	ready.value = useAsyncDataStatus()
	emit('ready')
});
</script>

<template>
	<div v-if="ready" class="col-full">
	<div v-if="forum" class="col-full push-top">
		<ul class="breadcrumbs">
			<li>
				<a href="/index.html"><i class="fa fa-home fa-btn"></i>Home</a>
			</li>
			<li><a href="/category.html">Discussions</a></li>
			<li class="active"><a href="#">Cooking</a></li>
		</ul>

		<div class="forum-header">
			<div class="forum-details">
				<h1>{{ forum.name }}</h1>
				<p class="text-lead">{{ forum.description }}</p>
			</div>
			<router-link
				:to="{ name: 'ThreadCreate', params: { forumId: forum.id } }"
				class="btn-green btn-small"
			>
				Start a thread
			</router-link>
		</div>
	</div>

	<div class="col-full push-top">
		<ThreadList :threads="threads" />
	</div>
</div>
</template>
