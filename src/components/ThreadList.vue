<script setup>
import { ref } from 'vue';
import sourceData from '../data.json';

const props = defineProps({
  threads: {
    type: Array,
    required: true
  }
})

const posts = ref(sourceData.posts);
const users = ref(sourceData.users);

const postById = postId => {
	return posts.value.find(p => p.id === postId);
};

const userById = userId => {
	return users.value.find(p => p.id === userId);
};
</script>

<template>
	<div class="col-full">
		<div class="thread-list">
			<h2 class="list-title">Threads</h2>

			<div v-for="thread in props.threads" :key="thread.id" class="thread">
				<div>
					<p>
						<router-link :to="{ name: 'ThreadShow', params: {id: thread.id}}">{{ thread.title }}</router-link>
					</p>
					<p class="text-faded text-xsmall">
						By <router-link :to="{}">{{ userById(thread.userId).name }}</router-link>
            , <AppDate :timestamp="thread.publishedAt"/>.
					</p>
				</div>

				<div class="activity">
					<p class="replies-count">
						{{ thread.posts.length }} replies
					</p>

					<img
						class="avatar-medium"
						:src="userById(thread.userId).avatar"
						alt=""
					/>

					<div>
						<p class="text-xsmall">
							<router-link :to="{}">{{ userById(thread.userId).name }}</router-link>
						</p>
						<AppDate :timestamp="thread.publishedAt"/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
