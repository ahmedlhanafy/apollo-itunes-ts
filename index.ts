import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import { apolloExpress, graphiqlExpress } from 'apollo-server';
import { makeExecutableSchema } from 'graphql-tools';
import config from './config';
import { schema, resolvers } from './api/graphql';

const PORT = process.env.PORT || 8080;

mongoose.connect(config.database);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

const executableSchema = makeExecutableSchema({
  typeDefs: [schema],
  resolvers: resolvers,
});

app.use(
  '/graphql',
  bodyParser.json(),
  apolloExpress(req => ({
    schema: executableSchema,
    context: { token: req.headers['x-access-token'] },
  })),
);

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
  }),
);

// tslint:disable:no-console
app.listen(PORT, () =>
  console.log(`Running a GraphQL API server at localhost:${PORT}/graphql...`),
);
