<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
	id: {
		required: true,
		type: String,
	},
});

const category = computed(() =>
	store.state.categories.find(c => c.id == props.id)
);

const getForumsForCategory = category =>
	store.state.forums.filter(f => f.categoryId == category.id);
</script>

<template>
	<h1>{{ category.name }}</h1>
	<ForumList :title="category.name" :forums="getForumsForCategory(category)" />
</template>
