<script setup>
import { useStore } from 'vuex';

const store = useStore()

const props = defineProps({
	categories: {
		required: true,
		type: Array,
	},
});

const getForumsForCategory = category => {
	return store.state.forums.filter(f => f.categoryId == category.id);
};
</script>

<template>
	<ForumList
		v-for="category in categories"
		:key="category.id"
		:forums="getForumsForCategory(category)"
		:title="category.name"
		:categoryId="category.id"
	/>
</template>
