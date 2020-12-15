import * as https from 'https'
import { GitHubUser } from './models/GitHubUser'

//definition of resolver methods
export const resolvers = {
    Query: {
        user: function (parent: any, args: { username: string }, context: any, info: any) {
            return getUserInformation(args.username)
        },
        mostSearched: async function (parent: any, args: { limit: number }, context: any, info: any) {
            return getUsersMostSearchedFor(args.limit)
        },
        mostPopular: function () {
            return resetSearchedForCounter()
        }
    },
}

let searchedUsers: GitHubUser[] = []

// All API requests must include a valid User-Agent header
const options = {
    headers: {
        'User-Agent': 'ppufek'
    }
}

function resetSearchedForCounter() {
    searchedUsers.forEach(function (element) {
        element.searchedForCounter = 0
    })
    return searchedUsers.sort(function (a, b) {
        return b.followers - a.followers
    });
}

function getUsersMostSearchedFor(limit:number) {
    if (searchedUsers.length !== 0) {
        if (limit !== undefined) {
            let mostlySearched = searchedUsers.sort(function (a, b) {
                return b.searchedForCounter - a.searchedForCounter;
            });
            return mostlySearched.slice(0, limit)
        } else {
            //return all users in list and sort by number of followers
            let sorted = searchedUsers.sort(function (a, b) {
                return b.followers - a.followers
            });
            return sorted
        }
    } else {
        return []
    }
}

function getUserEmail(username: string) : Promise<string> {

    return new Promise((resolve) => {
        https.get('https://api.github.com/users/' + username + '/events/public', options, (resp) => {
            let data = '';

            // Handle fragment of data
            resp.on('data', (receivedData) => {
                data += receivedData;
            });

            // Handle response
            resp.on('end', () => {
                let parsed = JSON.parse(data)
                let email = '' // default value of email that is inaccessible
                if (parsed.message === undefined) {
                    parsed.forEach((element: { payload: { commits: any } } | undefined) => {
                        if (element !== undefined) {
                            let commits = element.payload.commits
                            if (commits !== undefined) {
                                commits.forEach((element: { author: { email: string } | undefined }) => {
                                    if (element.author !== undefined) {
                                        email = element.author.email
                                    }
                                })
                            }
                        }
                    })
                }
                resolve(email)
            });
        })
    })
}

function getUserInformation(username:string) {
    return new Promise((resolve) => { // due to the asynchronous call
        https.get('https://api.github.com/users/' + username, options, (resp) => {
            let data = '';

            // Handle fragment of data
            resp.on('data', (receivedData) => {
                data += receivedData;
            });

            // Handle response
            resp.on('end', async function () {
                let parsed = JSON.parse(data)
                let newUser:GitHubUser | null
                let searchedUser = searchedUsers.find(user => user.username === username)

                if (searchedUsers.length !== 0 && searchedUser !== undefined) {
                    searchedUser.searchedForCounter++
                    newUser = searchedUser
                } else {
                    let email = await getUserEmail(username)
            
                    if (parsed.message === undefined) {
                        newUser = new GitHubUser(parsed.login, email, parsed.followers, parsed.following);
                        searchedUsers.push(newUser)
                        resolve(newUser)
                    } else {
                        newUser = null
                    }
                }
                resolve(newUser)
            })
        })
    })
}