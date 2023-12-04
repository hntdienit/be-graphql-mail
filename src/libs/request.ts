import axios from "axios";
import { envLib } from "./env";

export const hasuraAPI = axios.create({
  baseURL: envLib.hasura.api,
  withCredentials: true,
  headers: {
    "x-hasura-admin-secret": envLib.hasura.secret_admin_key,
  },
});
