<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { findById } from '../helpers';

const store = useStore();

const props = defineProps({
	threads: {
		type: Array,
		required: true,
	},
});

const posts = computed(() => store.state.posts.items);
const users = computed(() => store.state.users.items);

const postById = postId => findById(posts.value, postId);
const userById = userId => findById(users.value, userId) || {};
</script>

<template>
	<div class="col-full">
		<div class="thread-list">
			<h2 class="list-title">Threads</h2>
			<div v-if="threads.length">
				<div v-for="thread in props.threads" :key="thread.id" class="thread">
					<div>
						<p>
							<router-link
								v-if="thread.id"
								:to="{ name: 'ThreadShow', params: { id: thread.id } }"
							>
								{{ thread.title }}</router-link
							>
						</p>
						<p class="text-faded text-xsmall">
							By
							<a href="#" onclick="return false" v-if="thread.id">{{
								userById(thread.userId).name
							}}</a>
							, <AppDate :timestamp="thread.publishedAt" />.
						</p>
					</div>

					<div class="activity">
						<p class="replies-count">{{ thread.repliesCount }} replies</p>

						<img
							class="avatar-medium"
							:src="userById(thread.userId).avatar"
							alt=""
						/>

						<div>
							<p class="text-xsmall">
								<a href="#" onclick="return false" v-if="thread.id" :to="{}">{{
									userById(thread.userId).name
								}}</a>
							</p>
							<AppDate :timestamp="thread.publishedAt" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="!threads.length" style="padding: 10px; text-align: center">
			<em>No Threads Available</em>
		</div>
	</div>
</template>
