export class GitHubUser {

    constructor(username, email, followers, followed) {
        this.username = username
        this.email = email
        this.searchedForCounter = 1
        this.followers = followers
        this.followed = followed
    }

    getCounter() {
        return this.searchedForCounter
    }

    incrementCounter() {
        this.searchedForCounter++
    }
}