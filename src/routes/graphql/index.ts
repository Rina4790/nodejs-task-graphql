import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphql, GraphQLSchema } from "graphql";
import { graphqlBodySchema } from "./schema";
import { RootQuery } from "./routeSchema";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const { query, variables } = request.body;
      const schema: GraphQLSchema = new GraphQLSchema({
        query: RootQuery,
      });

      return await graphql({
        schema: schema,
        source: String(query),
        contextValue: fastify,
			variableValues: variables,
      });
    }
  );
};

export default plugin;
