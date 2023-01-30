import { FastifyInstance } from "fastify";
import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";
import { PostEntity } from "../../utils/DB/entities/DBPosts";
import { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import { UserEntity } from "../../utils/DB/entities/DBUsers";
import { ErrorMessages } from "./error";
import { MemberTypeGQL, PostGQL, ProfileGQL } from "./types";
import { GraphQLUser } from "./user";

export const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    users: {
      type: new GraphQLList(GraphQLUser),
      async resolve(
        source,
        args,
        fastify: FastifyInstance
      ): Promise<UserEntity[]> {
        return await fastify.db.users.findMany();
      },
    },
    profiles: {
      type: new GraphQLList(ProfileGQL),
      async resolve(
        source,
        args,
        fastify: FastifyInstance
      ): Promise<ProfileEntity[]> {
        return await fastify.db.profiles.findMany();
      },
    },
    posts: {
      type: new GraphQLList(PostGQL),
      async resolve(
        source,
        args,
        fastify: FastifyInstance
      ): Promise<PostEntity[]> {
        return await fastify.db.posts.findMany();
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberTypeGQL),
      async resolve(
        source,
        args,
        fastify: FastifyInstance
      ): Promise<MemberTypeEntity[]> {
        return await fastify.db.memberTypes.findMany();
      },
    },
    user: {
      type: GraphQLUser,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(_, { id }, fastify: FastifyInstance): Promise<UserEntity> {
        const user = await fastify.db.users.findOne({
          key: "id",
          equals: id,
        });
        if (!user) {
          throw fastify.httpErrors.notFound(ErrorMessages.NOT_FOUND);
        }
        return user;
      },
    },
    profile: {
      type: ProfileGQL,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(
        _,
        { id },
        fastify: FastifyInstance
      ): Promise<ProfileEntity> {
        const profile = await fastify.db.profiles.findOne({
          key: "id",
          equals: id,
        });
        if (!profile) {
          throw fastify.httpErrors.notFound(ErrorMessages.NOT_FOUND);
        }
        return profile;
      },
    },
    post: {
      type: PostGQL,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(_, { id }, fastify: FastifyInstance): Promise<PostEntity> {
        const post = await fastify.db.posts.findOne({
          key: "id",
          equals: id,
        });
        if (!post) {
          throw fastify.httpErrors.notFound(ErrorMessages.NOT_FOUND);
        }
        return post;
      },
    },
    memberType: {
      type: MemberTypeGQL,
      args: {
        id: { type: GraphQLString },
      },
      async resolve(
        _,
        { id },
        fastify: FastifyInstance
      ): Promise<MemberTypeEntity> {
        const memberType = await fastify.db.memberTypes.findOne({
          key: "id",
          equals: id,
        });
        if (!memberType) {
          throw fastify.httpErrors.notFound(ErrorMessages.NOT_FOUND);
        }
        return memberType;
      },
    },
  },
});
