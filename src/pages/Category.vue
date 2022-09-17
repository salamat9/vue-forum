<script setup>
import { computed, onMounted } from 'vue';
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

const category = computed(
	() => findById(store.state.categories, props.id) || {}
);

const getForumsForCategory = category =>
	store.state.forums.filter(f => f.categoryId == category.id);

onMounted(async () => {
	const category = await store.dispatch('fetchCategory', { id: props.id });
	await store.dispatch('fetchForums', { ids: category.forums });
	ready.value = useAsyncDataStatus()
	emit('ready')
});
</script>

<template>
	<div v-if="ready" class="col-full">
		<h1>{{ category.name }}</h1>
		<ForumList
			:title="category.name"
			:forums="getForumsForCategory(category)"
		/>
	</div>
</template>
