/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { Loading } from 'components';
import { useRouter } from 'next/router';
import { useAuth } from 'utils/hooks/useAuth';

export function withAuth(Component: any) {
	return function WithAuth(props: any) {
		const { user, loading } = useAuth();
		const router = useRouter();

		useEffect(() => {
			if (!loading && !user) {
				console.log('Not found user, require to sign in');
				router.push(`/login?redirect=${router.asPath}`);
			}
		}, [user, loading, router]);

		return user ? <Component {...props} /> : <Loading></Loading>;
	};
}
