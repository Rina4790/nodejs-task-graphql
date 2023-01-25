import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from "./schemas";
import type { UserEntity } from "../../utils/DB/entities/DBUsers";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<UserEntity[]> {
    const allUsers = fastify.db.users.findMany();
    return allUsers;
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const getUserById = await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (getUserById) return getUserById;
      else throw fastify.httpErrors.notFound("This user not found");
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const createdUser = await fastify.db.users.create(request.body);
        return createdUser;
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
    async function (request, reply): Promise<UserEntity> {
      try {
        const deletedUser = await fastify.db.users.delete(request.params.id);
        return deletedUser;
      } catch (error: any) {
        throw fastify.httpErrors.badRequest(error);
      }
    }
  );

  fastify.post(
    "/:id/subscribeTo",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const thisUser = await fastify.db.users.findOne({
        key: "id",
        equals: request.body.userId,
      });

      if (thisUser) {
        try {
          const subscribe = await fastify.db.users.change(request.body.userId, {
            subscribedToUserIds: [
              ...thisUser.subscribedToUserIds,
              request.params.id,
            ],
          });

          return subscribe;
        } catch (error: any) {
          throw fastify.httpErrors.badRequest(error);
        }
      } else throw fastify.httpErrors.badRequest("This user not found");
    }
  );

  fastify.post(
    "/:id/unsubscribeFrom",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const thisUser = await fastify.db.users.findOne({
        key: "id",
        equals: request.body.userId,
      });

      if (thisUser) {
        try {
          const followed = thisUser.subscribedToUserIds.indexOf(
            request.params.id
          );

          thisUser.subscribedToUserIds.splice(followed, 1);
          const unsubscribe = await fastify.db.users.change(
            request.body.userId,
            { subscribedToUserIds: [...thisUser.subscribedToUserIds] }
          );

          return unsubscribe;
        } catch (error: any) {
          throw fastify.httpErrors.badRequest(error);
        }
      } else throw fastify.httpErrors.badRequest("This user not found");
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const changedUser = await fastify.db.users.change(
          request.params.id,
          request.body
        );
        return changedUser;
      } catch (error: any) {
        throw fastify.httpErrors.badRequest(error);
      }
    }
  );
};

export default plugin;
