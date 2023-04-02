import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { summonerResolvers, summonerTypeDefs } from './graphql/summoner.graph';
import { BigIntTypeDefinition, BigIntResolver, JSONObjectDefinition, JSONObjectResolver } from 'graphql-scalars';
import { matchResolvers, matchTypeDefs } from './graphql/match.graph';
import { activeGameResolvers, activeGameTypeDefs } from './graphql/active-game.graph';

(async () => {
  const server = new ApolloServer({
    typeDefs: [BigIntTypeDefinition, JSONObjectDefinition, summonerTypeDefs, matchTypeDefs, activeGameTypeDefs],
    resolvers: {
      BigInt: BigIntResolver,
      JSONObject: JSONObjectResolver,
      ...summonerResolvers,
      ...matchResolvers,
      ...activeGameResolvers,
      Query: {
        ...summonerResolvers.Query,
        ...matchResolvers.Query
      }
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
})();