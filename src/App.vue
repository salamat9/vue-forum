<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import NProgress from 'nprogress';
import TheNavbar from '@/components/TheNavbar';
import AppNotifications from '@/components/AppNotifications';

const store = useStore();
const router = useRouter();
const route = useRoute();

const showPage = ref(false);

onMounted(async () => {
	NProgress.configure({
		speed: 200,
		showSpinner: false,
	});
	router.beforeEach(() => {
		showPage.value = false;
		NProgress.start();
	});
	await store.dispatch('auth/fetchAuthUser');
});

const onPageReady = () => {
	showPage.value = true;
	NProgress.done();
};
</script>

<template>
	<TheNavbar />
	<div class="container">
		<router-view v-show="showPage" @ready="onPageReady" :key="`${route.path}${JSON.stringify($route.query)}`" />
		<AppSpinner v-show="!showPage" />
	</div>
	<AppNotifications />
</template>

<style>
@import '../node_modules/nprogress/nprogress.css';

#nprogress .bar {
	background: #57ad8d !important;
}
</style>
