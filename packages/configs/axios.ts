import axios from "axios";
import { auth } from "./firebase";

const apiAxios = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    baseURL: "/api/v1",
});

apiAxios.interceptors.request.use(async (config) => {
    // console.log('Current user ' + auth.currentUser)
    // console.log('Auth ' + JSON.stringify(auth))
    if (auth.currentUser) {
        config.headers.Authorization = `Bearer ${
            (await auth.currentUser.getIdTokenResult()).token
        }`;
    }

    return config;
});

export { apiAxios };
