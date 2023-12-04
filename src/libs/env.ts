import { env } from "process";

export const envLib = {
  hasura: {
    api: env.HASURA_API,
    secret_admin_key: env.HASURA_ADMIN_SECRET,
  },
  google: {
    projectId: env.PROJECT_ID,
    clientId: env.CLIENT_ID,
    clientSecret: env.CLIENT_SECRET,
    refreshToken: env.REFRESH_TOKEN,
    redirectUri: env.REDIRECT_URI,
    googleApiUrl: env.GOOGLE_API_URL,
  },
  firebase: {
    apiKey: env.FIREBASE_APIKEY,
    authDomain: env.FIREBASE_AUTHDOMAIN,
    projectId: env.FIREBASE_PROJECTID,
    storageBucket: env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER,
    appId: env.FIREBASE_APP_ID,
    measurementId: env.FIREBASE_MENSUREMENT_ID,
  },
};
