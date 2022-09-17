<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
	posts: {
		type: Array,
		required: true,
	},
});

const editing = ref(null);

const users = computed(() => store.state.users);

const userById = userId => store.getters.user(userId);

const toggleEditMode = id => {
	editing.value = id === editing.value ? null : id;
};

const handleUpdate = event => {
	store.dispatch('updatePost', event.post)
	editing.value = null
}
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
				<div class="col-full">
					<PostEditor
						v-if="editing === post.id"
						:post="post"
						@save="handleUpdate($event)"
					/>
					<p v-else>
						{{ post.text }}
					</p>
				</div>
				<a
					v-if="post.userId === store.state.authId"
					@click.prevent="toggleEditMode(post.id)"
					href="#"
					style="margin-left: auto; padding-left: 10px"
					class="link-unstyled"
					title="Make a change"
				>
					<FA icon="pencil-alt" />
				</a>
			</div>

			<div class="post-date text-faded">
				<div v-if="post.edited?.at">edited</div>
				<AppDate :timestamp="post.publishedAt" />
			</div>
		</div>
	</div>
</template>
