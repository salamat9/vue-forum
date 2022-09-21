<script setup>
import useNotifications from '@/composables/useNotification';

const { notifications, removeNotification } = useNotifications();
</script>

<template>
	<div class="notifications">
		<div
			class="notification"
			v-for="notification in notifications"
			:key="notification.id"
		>
      <span>{{ notification.message }}</span>
			<button @click="removeNotification(notification.id)">X</button>
		</div>
	</div>
</template>
