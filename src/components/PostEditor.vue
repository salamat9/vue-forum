<script setup>
import { ref } from 'vue';

const emit = defineEmits(['save']);

const text = ref(null);

const save = () => {
	const postId = 'gggg' + Math.random();
	const post = {
    id: postId,
		text: text.value,
		publishedAt: Math.floor(Date.now() / 1000),
		userId: 'u4r8XCziZEWEXsj2UIKNHBoDh0n2',
	};

	emit('save', { post });

	text.value = '';
};
</script>
<template>
	<div class="col-full">
		<form @submit.prevent="save">
			<div class="form-group">
				<textarea
					v-model.trim="text"
					name=""
					id=""
					cols="30"
					rows="10"
					class="form-input"
				></textarea>
			</div>
			<div class="form-actions">
				<button class="btn btn-blue">Submit post</button>
			</div>
		</form>
	</div>
</template>
