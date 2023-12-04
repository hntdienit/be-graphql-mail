import { awsLambdaFastify } from "@fastify/aws-lambda";
import init from "..";
import { getDataMail } from "@services/mail";

const proxy = awsLambdaFastify(init());
export const handler = async (event: any, context: any) => {
  const res = await proxy(event, context);
    // await getDataMail();
  return res;
};
