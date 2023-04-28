import { useEffect, useState } from 'react';
import { firebaseAuth } from '@yours/configs';
import { User } from 'firebase/auth';

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
			setUser(user);
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	return { user, loading };
}
