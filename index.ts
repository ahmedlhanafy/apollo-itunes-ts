import * as express from 'express';
import * as bodyParser from 'body-parser';
import { apolloExpress, graphiqlExpress } from 'apollo-server';
import { makeExecutableSchema } from 'graphql-tools';
import { schema, resolvers } from './api/graphql';

const PORT = process.env.PORT || 8080;
const app = express();

const executableSchema = makeExecutableSchema({
  typeDefs: [schema],
  resolvers: resolvers,
});

app.use('/graphql', bodyParser.json(), apolloExpress({
  schema: executableSchema,
  context: {},
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

// tslint:disable-next-line:no-console
app.listen(PORT, () => console.log('Graphql server started successfully'));
