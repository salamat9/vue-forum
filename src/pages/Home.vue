<script setup>
import { ref } from 'vue';
import sourceData from '@/data.json';

const categories = ref(sourceData.categories);
</script>

<template>
	<h1>Welcome to the Forum</h1>
	<CategoryList :categories="categories" />
</template>
