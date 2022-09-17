<script setup>
import { onMounted } from "@vue/runtime-core";

const emit = defineEmits(['ready'])

onMounted(() => {
	emit('ready')
})
</script>

<template>
	<div class="col-full text-center">
		<h1>Not Found</h1>
    <router-link :to="{ name: 'Home' }">Read some cool threads</router-link>
	</div>
</template>
