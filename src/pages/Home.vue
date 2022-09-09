<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const categories = computed(() => {
	return store.state.categories;
});
</script>

<template>
	<h1 class="push-top">Welcome to the Forum</h1>
	<CategoryList :categories="categories" />
</template>
