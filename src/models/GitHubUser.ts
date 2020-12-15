export class GitHubUser {
  
  public username: string
  public email: string
  public searchedForCounter: number = 1
  public followers: number
  public followed: number

  constructor(username: string, email: string, followers: number, followed: number) {
    this.username = username
    this.email = email
    this.followers = followers
    this.followed = followed
  }
}