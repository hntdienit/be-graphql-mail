import { initializeApp } from "firebase/app";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { firebaseConfig } from "../configs";

const app = initializeApp(firebaseConfig);
export const firebase: FirebaseStorage = getStorage(app);
