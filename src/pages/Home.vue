<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { useAsyncDataStatus } from '@/composables/asyncDataStatus';

const store = useStore();

const emit = defineEmits(['ready'])

const categories = computed(() => {
	return store.state.categories.items;
});

const ready = ref(false)

onBeforeMount(async () => {
	const categories = await store.dispatch('categories/fetchAllCategories');
	const forumIds = categories.map(category => category.forums).flat();
	await store.dispatch('forums/fetchForums', { ids: forumIds });
	ready.value = useAsyncDataStatus()
	emit('ready')
});
</script>

<template>
	<div v-if="ready" class="col-full">
		<h1 class="push-top text-center">Welcome to the meme's forum</h1>
		<CategoryList :categories="categories" />
	</div>
</template>
