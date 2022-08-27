<script setup>
import { computed } from 'vue';
import sourceData from '@/data.json';

const props = defineProps({
	id: {
		required: true,
		type: String,
	},
});

const category = computed(() =>
	sourceData.categories.find(c => c.id == props.id)
);

const getForumsForCategory = category =>
	sourceData.forums.filter(f => f.categoryId == category.id);
</script>

<template>
	<h1>{{ category.name }}</h1>
	<ForumList :title="category.name" :forums="getForumsForCategory(category)" />
</template>
