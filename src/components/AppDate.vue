<script setup>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedDate from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime);
dayjs.extend(localizedDate);

const props = defineProps({
	timestamp: {
		type: Number,
		required: true,
	},
});

const diffForHumans = timestamp => dayjs.unix(timestamp).fromNow();

const humanFriendlyDate = timestamp =>
	dayjs.unix(timestamp).format('DD/MMMM/YYYY');
</script>

<template>
	<span :title="humanFriendlyDate(props.timestamp)">
		{{ diffForHumans(props.timestamp) }}
	</span>
</template>
