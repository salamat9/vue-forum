<script setup>
import { onMounted } from 'vue';

const emit = defineEmits(['ready']);
const props = defineProps({
	user: {
		required: true,
		type: Object,
	},
});

onMounted(() => {
	emit('ready');
});
</script>

<template>
	<div v-if="props.user">
		<div class="profile-card">
			<p class="text-center">
				<img
					:src="props.user.avatar"
					:alt="`${props.user.name} profile picture`"
					class="avatar-xlarge"
				/>
			</p>

			<h1 class="title">{{ props.user.username }}</h1>

			<p class="text-lead">{{ props.user.name }}</p>

			<p class="text-justify">{{ props.user.bio || 'No bio specified.' }}</p>

			<span class="online">{{ props.user.username }} is online</span>

			<div class="stats">
				<span>{{ props.user.postsCount }}</span>
				<span>{{ props.user.threadsCount }}</span>
			</div>

			<hr />

			<p v-if="props.user.website" class="text-large text-center">
				<i class="fa fa-globe"></i>
				<a :href="props.user.website">{{ props.user.website }}</a>
			</p>
		</div>
		<div class="text-center">
			<router-link :to="{ name: 'ProfileEdit' }" class="btn-green btn-small">
				Edit Profile
			</router-link>
		</div>
	</div>
</template>
