<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { useAsyncDataStatus } from '@/composables/asyncDataStatus';

const store = useStore();

const emit = defineEmits(['ready'])

const categories = computed(() => {
	return store.state.categories;
});

const ready = ref(false)

onBeforeMount(async () => {
	const categories = await store.dispatch('fetchAllCategories');
	const forumIds = categories.map(category => category.forums).flat();
	await store.dispatch('fetchForums', { ids: forumIds });
	ready.value = useAsyncDataStatus()
	emit('ready')
});
</script>

<template>
	<div v-if="ready" class="col-full">
		<h1 class="push-top text-center">Welcome to the Forum</h1>
		<CategoryList :categories="categories" />
	</div>
</template>
