API Documentation
Auth Routes
POST /auth/register

Registers a new user.
| Requirement | Details                                         |
| ----------- | ----------------------------------------------- |
| Auth        | No                                              |
| Body        | `firstName`, `lastName`, `username`, `password` |

{ "id": "uuid", "username": "john123" }

POST /auth/login

Returns a HttpOnly session cookie.
| Requirement | Details                |
| ----------- | ---------------------- |
| Auth        | No                     |
| Body        | `username`, `password` |

{ "id": "uuid", "username": "john123" }

POST /auth/logout
| Requirement | Details |
| ----------- | ------- |
| Auth        | Yes     |

{ "message": "Success" }

GET /auth/me

Returns the current authenticated user.
| Requirement | Details |
| ----------- | ------- |
| Auth        | Yes     |

{ "id": "uuid", "username": "john123" }

PATCH /auth/update-profile
| Requirement | Details                   |
| ----------- | ------------------------- |
| Auth        | Yes                       |
| Body        | Any subset of user fields |

{ "id": "uuid", "firstName": "Updated" }

PATCH /auth/update-avatar
| Requirement | Details             |
| ----------- | ------------------- |
| Auth        | Yes                 |
| Upload      | `avatar` (jpeg/png) |

{ "updatedAvatarFileName": "avatar.png" }

Post Routes
POST /user/post
| Requirement | Details                  |
| ----------- | ------------------------ |
| Auth        | Yes                      |
| Body        | `content` (no profanity) |

{ "id": "uuid", "content": "Hello world!" }

GET /user/posts
| Query    | Description       |
| -------- | ----------------- |
| `take`   | default 10        |
| `cursor` | pagination cursor |

{ "posts": [...], "nextCursor": "abc" }

GET /user/post/:postId
{ "id": "uuid", "content": "Example post" }

GET /user/posts/:userId
{ "posts": [...], "nextCursor": "abc" }

Comment Routes
POST /user/comment/:postId
| Requirement | Details   |
| ----------- | --------- |
| Auth        | Yes       |
| Body        | `content` |

{ "id": "uuid", "content": "Nice post!" }

GET /user/comments/:postId
{ "comments": [...], "nextCursor": "abc" }

Like Routes
POST /user/post/like/:postId
| Requirement | Details |
| ----------- | ------- |
| Auth        | Yes     |

{ "id": "uuid" }

DELETE /user/post/like/:likeId
204 No Content

Retweet Routes
POST /user/post/retweet/:postId
| Requirement | Details |
| ----------- | ------- |
| Auth        | Yes     |

{ "id": "uuid" }

DELETE /user/post/retweet/:retweetId
204 No Content
