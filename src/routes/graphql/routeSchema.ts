import { FastifyInstance } from "fastify";
import {
  GraphQLList,
  GraphQLNonNull,
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
        context: FastifyInstance
      ): Promise<UserEntity[]> {
        return await context.db.users.findMany();
      },
    },
    profiles: {
      type: new GraphQLList(ProfileGQL),
      async resolve(
        source,
        args,
        context: FastifyInstance
      ): Promise<ProfileEntity[]> {
        return await context.db.profiles.findMany();
      },
    },
    posts: {
      type: new GraphQLList(PostGQL),
      async resolve(
        source,
        args,
        context: FastifyInstance
      ): Promise<PostEntity[]> {
        return await context.db.posts.findMany();
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberTypeGQL),
      async resolve(
        source,
        args,
        context: FastifyInstance
      ): Promise<MemberTypeEntity[]> {
        return await context.db.memberTypes.findMany();
      },
    },
    user: {
      type: GraphQLUser,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, { id }, context: FastifyInstance): Promise<UserEntity> {
        const user = await context.db.users.findOne({
          key: "id",
          equals: id,
        });

        if (!user) {
          throw context.httpErrors.notFound(ErrorMessages.NOT_FOUND);
        }

        return user;
      },
    },
    profile: {
      type: ProfileGQL,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(
        _,
        { id },
        context: FastifyInstance
      ): Promise<ProfileEntity> {
        const profile = await context.db.profiles.findOne({
          key: "id",
          equals: id,
        });

        if (!profile) {
          throw context.httpErrors.notFound(ErrorMessages.NOT_FOUND);
        }

        return profile;
      },
    },
    post: {
      type: PostGQL,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, { id }, context: FastifyInstance): Promise<PostEntity> {
        const post = await context.db.posts.findOne({
          key: "id",
          equals: id,
        });

        if (!post) {
          throw context.httpErrors.notFound(ErrorMessages.NOT_FOUND);
        }

        return post;
      },
    },
    memberType: {
      type: MemberTypeGQL,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(
        _,
        { id },
        context: FastifyInstance
      ): Promise<MemberTypeEntity> {
        const memberType = await context.db.memberTypes.findOne({
          key: "id",
          equals: id,
        });

        if (!memberType) {
          throw context.httpErrors.notFound(ErrorMessages.NOT_FOUND);
        }

        return memberType;
      },
    },
  },
});
