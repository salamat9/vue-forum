<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { findById } from '@/helpers';
import { useRoute, useRouter } from 'vue-router';
import { useAsyncDataStatus } from '@/composables/asyncDataStatus';

const store = useStore();
const router = useRouter();
const route = useRoute();

const emit = defineEmits(['ready']);
const props = defineProps({
	id: {
		required: true,
		type: String,
	},
});

const ready = ref(false);
const page = ref(parseInt(route.query.page) || 1);
const perPage = ref(10);

const forum = computed(() => {
	return findById(store.state.forums.items, props.id);
});

const threads = computed(() => {
	if (!forum.value) return [];
	return store.state.threads.items
		.filter(thread => thread.forumId == forum.value.id)
		.map(thread => store.getters['threads/thread'](thread.id));
});

const threadCount = computed(() => forum.value?.threads?.length || 0);

const totalPages = computed(() => {
	if (!threadCount.value) return 0;
	return Math.ceil(threadCount.value / perPage.value);
});

watch(page, async () => {
	router.push({ query: { page: page.value } });
});

onMounted(async () => {
	const forum = await store.dispatch('forums/fetchForum', { id: props.id });
	const threads = await store.dispatch('threads/fetchThreadsByPage', {
		ids: forum.threads,
		page: page.value,
		perPage: perPage.value,
	});

	await store.dispatch('users/fetchUsers', {
		ids: threads.map(thread => thread.userId),
	});
	ready.value = useAsyncDataStatus();
	emit('ready');
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
			<VPagination v-model="page" :pages="totalPages" active-color="#57AD8D" />
		</div>
	</div>
</template>
