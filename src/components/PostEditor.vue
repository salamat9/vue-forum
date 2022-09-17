<script setup>
import { reactive, ref } from 'vue';

const emit = defineEmits(['save']);
const props = defineProps({
	post: {
		type: Object,
		default: () => ({ text: null }),
	},
});

const postCopy = reactive({ ...props.post })

const save = () => {
	emit('save', { post: postCopy });

	postCopy.text = '';
};
</script>

<template>
	<div class="col-full">
		<form @submit.prevent="save">
			<div class="form-group">
				<textarea
					v-model.trim="postCopy.text"
					name=""
					id=""
					cols="30"
					rows="10"
					class="form-input"
				></textarea>
			</div>
			<div class="form-actions">
				<button class="btn btn-blue">{{ post.id ? 'Update post' : 'Submit post'}}</button>
			</div>
		</form>
	</div>
</template>
