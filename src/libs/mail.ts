import { google } from "googleapis";
import { env } from "process";
import { googleConfig } from "../configs";

const createGoogleMail = (opts: any) => {
  const oAuth2Client = new google.auth.OAuth2(opts);
  oAuth2Client.setCredentials({ refresh_token: env.REFRESH_TOKEN });
  return oAuth2Client;
};

export const getMail = async () => {
  const request = createGoogleMail(googleConfig);

  const { token } = await request.getAccessToken();

  const gmail = google.gmail({
    version: "v1",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return gmail;
};
