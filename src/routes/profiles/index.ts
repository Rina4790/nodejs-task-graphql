import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createProfileBodySchema, changeProfileBodySchema } from "./schema";
import type { ProfileEntity } from "../../utils/DB/entities/DBProfiles";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<ProfileEntity[]> {
    const allProfiles = await fastify.db.profiles.findMany();
    return allProfiles;
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const getProfileById = await fastify.db.profiles.findOne({
        key: "id",
        equals: request.params.id,
      });
      if (getProfileById) return getProfileById;
      else throw fastify.httpErrors.notFound("This profile not found");
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        const createdProfile = await fastify.db.profiles.create(request.body);
        return createdProfile;
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
    async function (request, reply): Promise<ProfileEntity> {
      try {
        const deletedProfile = await fastify.db.profiles.delete(
          request.params.id
        );
        return deletedProfile;
      } catch (error: any) {
        throw fastify.httpErrors.badRequest(error);
      }
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        const changedProfile = await fastify.db.profiles.change(
          request.params.id,
          request.body
        );
        return changedProfile;
      } catch (error: any) {
        throw fastify.httpErrors.badRequest(error);
      }
    }
  );
};

export default plugin;
