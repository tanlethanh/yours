import axios from 'axios';

import { firebaseAuth } from './firebase';

const apiAxios = axios.create({
	headers: {
		'Content-Type': 'application/json',
	},
	baseURL: '/api/v1',
});

apiAxios.interceptors.request.use(async (config) => {
	if (firebaseAuth.currentUser) {
		config.headers.Authorization = `Bearer ${
			(await firebaseAuth.currentUser.getIdTokenResult()).token
		}`;
	}

	return config;
});

export { apiAxios };
