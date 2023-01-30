import { FastifyInstance } from 'fastify';
import {
	GraphQLID,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from 'graphql';
import { MemberTypeGQL } from './types';
import { PostGQL } from './types';
import { ProfileGQL } from './types';

// @ts-ignore
export const GraphQLUser = new GraphQLObjectType({
	name: 'GraphQLUser',
	fields: () => ({
		id: { type: GraphQLID },
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		email: { type: GraphQLString },
		subscribedToUserIds: {
			type: new GraphQLList(GraphQLString),
		},
		subscribedToUser: {
			type: new GraphQLList(GraphQLUser),
			resolve: async (
				{ subscribedToUserIds },
				args,
				fastify: FastifyInstance
			) => {
				return await fastify.db.users.findMany({
					key: 'id',
					equalsAnyOf: subscribedToUserIds,
				});
			},
		},
		userSubscribedTo: {
			type: new GraphQLList(GraphQLUser),
			resolve: async ({ id }, _, fastify: FastifyInstance) =>
			  await fastify.db.users.findMany({ key: "subscribedToUserIds", inArray: id }),
		 },
		memberType: {
			type: MemberTypeGQL,
			async resolve({ id }, args, fastify: FastifyInstance) {
				const profile = await fastify.db.profiles.findOne({
					key: 'userId',
					equals: id,
				});
				if (!profile) {
					return Promise.resolve(null);
				}
				return await fastify.db.memberTypes.findOne({
					key: 'id',
					equals: profile.memberTypeId,
				});
			},
		},
		posts: {
			type: new GraphQLList (PostGQL),
			async resolve({ id }, args, fastify: FastifyInstance) {
				return await fastify.db.posts.findMany({
					key: 'userId',
					equals: id,
				});
			},
		},
		profile: {
			type: ProfileGQL,
			async resolve({ id }, args, fastify: FastifyInstance) {
				return await fastify.db.profiles.findOne({
					key: 'userId',
					equals: id,
				});
			},
		},
	}),
});