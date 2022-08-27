<script setup>
import sourceData from '@/data.json';

const props = defineProps({
	categories: {
		required: true,
		type: Array,
	},
});

const getForumsForCategory = category => {
	return sourceData.forums.filter(f => f.categoryId == category.id);
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
