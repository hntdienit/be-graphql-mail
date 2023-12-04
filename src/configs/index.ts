import { envLib } from "@lib/env";
import { FirebaseOptions } from "firebase/app";

export const firebaseConfig: FirebaseOptions = {
  apiKey: envLib.firebase.apiKey,
  authDomain: envLib.firebase.authDomain,
  projectId: envLib.firebase.projectId,
  storageBucket: envLib.firebase.storageBucket,
  messagingSenderId: envLib.firebase.messagingSenderId,
  appId: envLib.firebase.appId,
  measurementId: envLib.firebase.measurementId,
};

interface GoogleEmailOptions {
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  redirectUri?: string;
  googleApiUrl?: string;
}

export const googleConfig: GoogleEmailOptions = {
  clientId: envLib.google.clientId,
  clientSecret: envLib.google.clientSecret,
  refreshToken: envLib.google.refreshToken,
  redirectUri: envLib.google.redirectUri,
  googleApiUrl: envLib.google.googleApiUrl,
};
