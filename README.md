# NodeJS backend GraphQL API application


Application that provides the ability to list and track GitHub users data
## Table of contents
* [Installation](#installation)
* [Architecture considerations](#architecture-considerations)
* [Priorities](#priorities)
* [Additional Information](#additional-information)
* [Resources](#resources)

## Installation

1. To run the project, first download all required dependencies by executing the command
```bash
yarn install
```
2. Run the project with the following command:

```bash
yarn dev
```
3. Wait until the following line is visible in the console: 

```bash
The server ready at http://localhost:4000/graphql
```
4. Open your web browser and navigate to GraphQL Playground at http://localhost:4000/graphql


The examples of queries that can be sent are listed in the examples below:

- user - get information about GitHub user for a given _username_

```typescript
query {
  user(username: "ppufek") {
    username
    email
    searchedForCounter
    followers
    followed
  }
}
```
- mostSearched - get list of searched users sorted by _searchedForCounter_ property (how many times it has been returned by this API)

```typescript
query {
  mostSearched(limit: 10) {
    username
    email
    searchedForCounter
    followers
    followed
  }
}
```
- mostPopular - reset _searchedForCounter_ for all searched users

```typescript
query {
  mostPopular {
    username
    email
    searchedForCounter
    followers
    followed
  }
}
```

## Architecture considerations

- Main entry point of the project - index.ts

- Model: GitHubUser.ts
- Resolvers: resolvers.ts
- GraphQL schema: graphQLSchema.ts


# Priorities
- response formatted in JSON for all requests
- get user information for a given GitHub username
- get users most searched for (sort by _searchedForCounter_ in GitHubUser model)
    - if _limit_ parameter is not provided, list of all searched users is returned, sorted by number of followers
- delete - reset all GitHub users' properties _searchedForCounter_ to 0 

### Additional information

If any user has not been searched yet, an empty list is returned in a response when getting the information users most searched for
> { "data": { "mostSearched": [] } }

If for a given username Github account does not exist, null value is returned in a response
> { "data": { "user": null } }

After resetting the counter to 0, the list of all searched users is returned, sorted by number of followers


Due to the missing value for '_email_' key at `https://api.github.com/users/{username}`, additional API call had to be made to `https://api.github.com/users/{username}/events/public` to retrieve value for email address, if users' data is available.

## Resources 
[GitHub](https://developer.github.com/v3/)