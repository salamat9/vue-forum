<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import NProgress from 'nprogress';
import TheNavbar from '@/components/TheNavbar';

const store = useStore();
const router = useRouter();

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
	await store.dispatch('fetchAuthUser');
});

const onPageReady = () => {
	showPage.value = true;
	NProgress.done();
};
</script>

<template>
	<TheNavbar />
	<div class="container">
		<router-view v-show="showPage" @ready="onPageReady" />
		<AppSpinner v-show="!showPage" />
	</div>
</template>

<style>
@import '../node_modules/nprogress/nprogress.css';

#nprogress .bar {
	background: #57ad8d !important;
}
</style>
