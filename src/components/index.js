import AppDate from '@/components/AppDate';
import AppSpinner from '@/components/AppSpinner';
import ThreadList from '@/components/ThreadList';
import ForumList from '@/components/ForumList';
import CategoryList from '@/components/CategoryList';
import PostList from '@/components/PostList';
import PostEditor from '@/components/PostEditor';

export default [
	{
		name: 'AppDate',
		component: AppDate,
	},
	{
		name: 'AppSpinner',
		component: AppSpinner,
	},
	{
		name: 'ThreadList',
		component: ThreadList,
	},
	{
		name: 'ForumList',
		component: ForumList,
	},
	{
		name: 'CategoryList',
		component: CategoryList,
	},
	{
		name: 'PostList',
		component: PostList,
	},
	{
		name: 'PostEditor',
		component: PostEditor,
	},
];
