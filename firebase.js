// Import Firebase
import { initializeApp } from 'firebase/app';
import { getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; 
import Constants from 'expo-constants';


// Your Firebase configuration

const firebaseConfig = {
        apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
        authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
        projectId: Constants.expoConfig?.extra?.firebaseProjectId,
        storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
        messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
        appId: Constants.expoConfig?.extra?.firebaseAppId,
        measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);
const storage = getStorage(app);
// Initialize Firestore
const db = getFirestore(app);

export { auth, db, storage };
