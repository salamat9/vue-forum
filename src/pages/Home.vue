<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const categories = computed(() => {
	return store.state.categories;
});

onBeforeMount(async () => {
	const categories = await store.dispatch('fetchAllCategories');
	const forumIds = categories.map(category => category.forums).flat();
	store.dispatch('fetchForums', { ids: forumIds });
});
</script>

<template>
	<h1 class="push-top">Welcome to the Forum</h1>
	<CategoryList :categories="categories" />
</template>
