import { useEffect } from 'react';
import { useAuth } from 'utils/hooks/useAuth';
import { useRouter } from 'next/router';
import {Loading} from 'components';

export function withAuth(Component: any) {
    return function WithAuth(props: any) {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                console.log('Not found user, require to sign in');
                router.replace(`/login?redirect=${router.asPath}`);
            }
        }, [user, loading, router]);

        return user ? <Component {...props} /> : <Loading></Loading>;
    };
}