import { ApolloFastifyContextFunction } from "@as-integrations/fastify";
import { envLib } from "@lib/env";
import jwt from "jsonwebtoken";

export interface AuthContext {
  user: {
    aud: string;
    exp: number;
    iat: number;
  };
}

export const authContextFunction: ApolloFastifyContextFunction<AuthContext> = async (request, reply) => {
  const user = {
    aud: "",
    iat: 0,
    exp: 0,
  };
  // const token: string = request.headers.authorization || ""; // Bearer token
  // if (token !== "") {
  //   const accessToken: string = token.split(" ")[1];
  //   try {
  //     const decoded = Object(jwt.verify(accessToken, envLib.jwt.accessToken as string));
  //     return { user: { ...decoded } };
  //   } catch (err: any) {
  //     throw new Error(err);
  //   }
  // }

  return { user };
};
