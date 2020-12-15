import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { resolvers } from './resolvers'
import { typeDefs } from './graphQLSchema'

const app = express()

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
    console.log(`The server ready at http://localhost:4000${server.graphqlPath}`)
)