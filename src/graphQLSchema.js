import { gql } from "apollo-server-express"

export const typeDefs = gql`
    type Query {
        hello: String!
        user(username: String!): GithubUser
        mostSearched(limit: Int): [GithubUser]
        mostPopular: [GithubUser]
    }

    type GithubUser {
        username: String
        email: String
        searchedForCounter: Int
        followers: Int
        followed: Int
    }
`