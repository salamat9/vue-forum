<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import UserProfileCard from '@/components/UserProfileCard';
import UserProfileCardEditor from '@/components/UserProfileCardEditor';
import { onBeforeRouteLeave } from 'vue-router';
import AppInfiniteScroll from '@/components/AppInfiniteScroll';

const store = useStore();

const emit = defineEmits(['ready']);
const props = defineProps({
	edit: {
		type: Boolean,
		default: false,
	},
});

const user = computed(() => store.getters['auth/authUser']);

const lastPostFetched = computed(() => {
	if (user.value.posts.length === 0) return null;
	return user.value.posts[user.value.posts.length - 1];
});

const fetchUserPosts = async () => {
	return await store.dispatch('auth/fetchAuthUsersPosts', {
		startAfter: lastPostFetched.value,
	});
};

onMounted(async () => {
	await fetchUserPosts();
	emit('ready');
});
</script>

<template>
	<div class="container" style="width: 100%">
		<div class="flex-grid">
			<div class="col-3 push-top">
				<UserProfileCard v-if="!edit" :user="user" />
				<UserProfileCardEditor v-else :user="user" />
			</div>

			<div class="col-7 push-top">
				<div class="profile-header">
					<span class="text-lead">{{ user?.username }} recent activity</span>
				</div>

				<hr />
				<PostList :posts="user?.posts" />
				<AppInfiniteScroll
					@load="fetchUserPosts"
					:done="user.posts.length === user.postsCount"
				/>
			</div>
		</div>
	</div>
</template>
