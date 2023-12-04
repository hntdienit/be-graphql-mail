import { schedule } from "@netlify/functions";
import { getDataMail } from "@services/mail";

export const handler = schedule("*/5 * * * *", async (event: any) => {
  await getDataMail();

  return {
    statusCode: 200,
    body: "Get data successfully",
  };
});
