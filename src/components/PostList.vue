<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
	posts: {
		type: Array,
		required: true,
	},
});

const users = computed(() => store.state.users);

const userById = userId => store.getters.user(userId);
</script>

<template>
	<div class="post-list">
		<div v-for="post in props.posts" :key="post.id" class="post">
			<div v-if="userById(post.userId)" class="user-info">
				<a href="#" class="user-name">
					{{ userById(post.userId).name }}
				</a>

				<a href="#">
					<img
						class="avatar-large"
						:src="userById(post.userId).avatar"
						alt=""
					/>
				</a>

				<p class="desktop-only text-small">
					{{ userById(post.userId).postsCount }}
				</p>
				<p class="desktop-only text-small">
					{{ userById(post.userId).threadsCount }}
				</p>
			</div>

			<div class="post-content">
				<div>
					<p>
						{{ post.text }}
					</p>
				</div>
				<a
					href="#"
					style="margin-left: auto"
					class="link-unstyled"
					title="Make a change"
					><i class="fa fa-pencil"></i
				></a>
			</div>

			<div class="post-date text-faded">
				<AppDate :timestamp="post.publishedAt" />
			</div>
		</div>
	</div>
</template>
