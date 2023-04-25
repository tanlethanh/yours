import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCcIeyejgFZUetpmPzmfqxNM3AXz8cQDGg",
    authDomain: "sipo-english-8266.firebaseapp.com",
    projectId: "sipo-english-8266",
    storageBucket: "sipo-english-8266.appspot.com",
    messagingSenderId: "333668151519",
    appId: "1:333668151519:web:afa3f0f01db6aabe8b396a",
    measurementId: "G-L5VKZ58L1V",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
auth.languageCode = "it";

export { app as firebaseApp, auth as firebaseAuth };
