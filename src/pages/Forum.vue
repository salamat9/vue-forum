<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { findById } from '@/helpers';

const store = useStore();

const props = defineProps({
	id: {
		required: true,
		type: String,
	},
});

const forum = computed(() => {
	return findById(store.state.forums, props.id)
});

const threads = computed(() => {
	return forum._value.threads.map(threadId => store.getters.thread(threadId))
});
</script>

<template>
	<div class="container">
		<div class="col-full push-top">
			<ul class="breadcrumbs">
				<li>
					<a href="/index.html"><i class="fa fa-home fa-btn"></i>Home</a>
				</li>
				<li><a href="/category.html">Discussions</a></li>
				<li class="active"><a href="#">Cooking</a></li>
			</ul>

			<div class="forum-header">
				<div class="forum-details">
					<h1>{{ forum.name }}</h1>
					<p class="text-lead">{{ forum.description }}</p>
				</div>
				<router-link
					:to="{ name: 'ThreadCreate', params: { forumId: forum.id } }"
					class="btn-green btn-small"
				>
					Start a thread
				</router-link>
			</div>
		</div>

		<div class="col-full push-top">
			<ThreadList :threads="threads" />
		</div>
	</div>
</template>
