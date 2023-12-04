import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import { ApolloServer } from "@apollo/server";
import { fastifyApolloHandler, fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import { AuthContext, authContextFunction } from "./contexts/auth-context";
import { Resolver } from "./graphql/resolvers";
import { TypeDefs } from "./graphql/typeDefs";

const App = (options: FastifyServerOptions) => {
  const app = fastify(options);

  const apollo = new ApolloServer<AuthContext>({
    typeDefs: TypeDefs,
    resolvers: Resolver,
    plugins: [fastifyApolloDrainPlugin(app)],
  });

  (async () => {
    await apollo.start();
  })();

  app.register(async (app: FastifyInstance) => {
    app.route({
      url: "/graphql",
      method: ["GET", "POST", "OPTIONS"],
      handler: fastifyApolloHandler(apollo, {
        context: authContextFunction,
      }),
    });
  });
  app.get("/", (request, reply) => reply.send({ hello: "world" }));

  return app;
};
export default App;
