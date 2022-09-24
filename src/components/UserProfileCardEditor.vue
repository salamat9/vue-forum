<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import AppSpinner from './AppSpinner.vue';

const store = useStore();
const router = useRouter();

const emit = defineEmits(['ready']);
const props = defineProps({
	user: {
		required: true,
		type: Object,
	},
});

const uploadingImage = ref(false);
let activeUser = reactive({ ...props.user });

const save = () => {
	store.dispatch('users/updateUser', { ...activeUser });
	router.push({ name: 'Profile' });
};

const cancel = () => {
	router.push({ name: 'Profile' });
};

const handleAvatarUpload = async e => {
	uploadingImage.value = true;
	const file = e.target.files[0];
	const uploadedImage = await store.dispatch('auth/uploadAvatar', { file });
	activeUser = uploadedImage || this.activeUser.avatar;
	uploadingImage.value = false;
};

onMounted(() => {
	emit('ready');
});
</script>

<template>
	<div v-if="user" class="profile-card">
		<form @submit.prevent="save">
			<p class="text-center avatar-edit">
				<label for="avatar">
					<img
						:src="activeUser.avatar"
						id="avatar-img"
						:alt="`${user.name} profile picture`"
						class="avatar-xlarge img-update"
					/>
					<div class="avatar-upload-overlay">
						<AppSpinner v-if="uploadingImage" color="white" />
						<FA
							v-else
							icon="camera"
							size="3x"
							:style="{ color: 'white', opacity: '8' }"
						/>
					</div>
					<input
						v-show="false"
						id="avatar"
						type="file"
						@change="handleAvatarUpload"
					/>
				</label>
			</p>

			<div class="form-group">
				<input
					v-model="activeUser.username"
					type="text"
					placeholder="Username"
					class="form-input text-lead text-bold"
				/>
			</div>

			<div class="form-group">
				<input
					v-model="activeUser.name"
					type="text"
					placeholder="Full Name"
					class="form-input text-lead"
				/>
			</div>

			<div class="form-group">
				<label for="user_bio">Bio</label>
				<textarea
					v-model="activeUser.bio"
					class="form-input"
					id="user_bio"
					placeholder="Write a few words about yourself."
				></textarea>
			</div>

			<div class="stats">
				<span>{{ user.postsCount }}</span>
				<span>{{ user.threadsCount }}</span>
			</div>

			<hr />

			<div class="form-group">
				<label class="form-label" for="user_website">Website</label>
				<input
					v-model="activeUser.website"
					autocomplete="off"
					class="form-input"
					id="user_website"
				/>
			</div>

			<div class="form-group">
				<label class="form-label" for="user_email">Email</label>
				<input
					v-model="activeUser.email"
					autocomplete="off"
					class="form-input"
					id="user_email"
				/>
			</div>

			<div class="form-group">
				<label class="form-label" for="user_location">Location</label>
				<input
					v-model="activeUser.location"
					autocomplete="off"
					class="form-input"
					id="user_location"
				/>
			</div>

			<div class="btn-group space-between">
				<button type="button" class="btn-ghost" @click.prevent="cancel">
					Cancel
				</button>
				<button type="submit" class="btn-blue">Save</button>
			</div>
		</form>
	</div>
</template>
