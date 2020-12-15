import { gql } from 'apollo-server-express'

export const typeDefs = gql`
    type Query {
        hello: String!
        user(username: String!): GitHubUser
        mostSearched(limit: Int): [GitHubUser]
        mostPopular: [GitHubUser]
    }

    type GitHubUser {
        username: String
        email: String
        searchedForCounter: Int
        followers: Int
        followed: Int
    }
`