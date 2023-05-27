import { useEffect, useRef } from 'react';
import { apiAxios } from '@yours/configs';
import { useRouter } from 'next/router';
import { MainLayout, withAuth } from 'utils';

function RedirectPage() {
	const router = useRouter();
	const { query } = router;
	const dataFetchedRef = useRef(false);

	const fetchData = async () => {
		await apiAxios.post(`notion/auth?code=${query.code}`);
		router.push('/dashboard');
	};

	useEffect(() => {
		if (!router.isReady || dataFetchedRef.current) return;
		dataFetchedRef.current = true;
		try {
			fetchData();
		} catch (error) {
			console.log('Something wrong');
			console.log(error);
		}
	}, [router.isReady]);

	return (
		<MainLayout withHeader={false}>
			<div className="flex flex-col items-center justify-center h-screen">
				<h1 className="text-2xl">Please wait</h1>
				<p>{query.code}</p>
			</div>
		</MainLayout>
	);
}

export default withAuth(RedirectPage);
