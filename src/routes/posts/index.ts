import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createPostBodySchema, changePostBodySchema } from "./schema";
import type { PostEntity } from "../../utils/DB/entities/DBPosts";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<PostEntity[]> {
    const allPosts = await fastify.db.posts.findMany();
    return allPosts;
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const getPostById = await fastify.db.posts.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (getPostById) return getPostById;
      else throw fastify.httpErrors.notFound("This post not found");
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        const createdPost = await fastify.db.posts.create(request.body);
        return createdPost;
      } catch (error: any) {
        throw fastify.httpErrors.badRequest(error);
      }
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        const deletedPost = await fastify.db.posts.delete(request.params.id);
        return deletedPost;
      } catch (error: any) {
        throw fastify.httpErrors.badRequest(error);
      }
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        const changedPost = await fastify.db.posts.change(
          request.params.id,
          request.body
        );
        return changedPost;
      } catch (error: any) {
        throw fastify.httpErrors.badRequest(error);
      }
    }
  );
};

export default plugin;
