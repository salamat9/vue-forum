<script setup>
import { computed } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedDate from 'dayjs/plugin/localizedFormat';

dayjs.extend(relativeTime);
dayjs.extend(localizedDate);

const props = defineProps({
	timestamp: {
		type: [Number, Object],
	},
});

const diffForHumans = timestamp => dayjs.unix(timestamp).fromNow();

const humanFriendlyDate = timestamp =>
	dayjs.unix(timestamp).format('DD/MMMM/YYYY');

const normalizedTimestamp = computed(
	() => props.timestamp?.seconds || props.timestamp
);
</script>

<template>
	<span :title="humanFriendlyDate(normalizedTimestamp)">
		{{ diffForHumans(normalizedTimestamp) }}
	</span>
</template>
