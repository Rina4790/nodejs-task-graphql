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
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!user) throw fastify.httpErrors.badRequest("This user not found");

      const posts = await fastify.db.posts.findMany({
        key: "userId",
        equals: request.params.id,
      });
      if (posts) {
        try {
          posts.map(async (post) => {
            await fastify.db.posts.delete(post.id);
          });
        } catch (error: any) {
          throw fastify.httpErrors.badRequest(error);
        }
      }

      const profile = await fastify.db.profiles.findOne({
        key: "userId",
        equals: request.params.id,
      });

      if (profile) {
        await fastify.db.profiles.delete(profile.id);
      }

      const subscribes = await fastify.db.users.findMany({
        key: "subscribedToUserIds",
        inArray: request.params.id,
      });

      try {
        subscribes.map(async (subscribe) => {
          const subscrIndex = subscribe.subscribedToUserIds.indexOf(
            request.params.id
          );

          subscribe.subscribedToUserIds.splice(subscrIndex, 1);

          await fastify.db.users.change(subscribe.id, {
            subscribedToUserIds: subscribe.subscribedToUserIds,
          });
        });
      } catch (error: any) {
        throw fastify.httpErrors.badRequest(error);
      }

      const deletedUser = await fastify.db.users.delete(request.params.id);
      return deletedUser;
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
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (!user) throw fastify.httpErrors.notFound("This user not found");

      const follower = await fastify.db.users.findOne({
        key: "id",
        equals: request.body.userId,
      });
      if (!follower) throw fastify.httpErrors.badRequest("Follower not found");

      const subscribeIndex = follower.subscribedToUserIds.indexOf(user.id);
      if (subscribeIndex == -1)
        throw fastify.httpErrors.badRequest("User is not following him");

      follower.subscribedToUserIds.splice(subscribeIndex, 1);
      const unsubscribe = fastify.db.users.change(follower.id, {
        subscribedToUserIds: follower.subscribedToUserIds,
      });
      return unsubscribe;
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
