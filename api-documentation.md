# `Flux`

## Database Schema Design

![db-schema]

[db-schema]: ./images/flux-db-schema.PNG

## API Documentation

## USER AUTHENTICATION/AUTHORIZATION

### All endpoints that require authentication

All endpoints that require a current user to be logged in.

- Request: endpoints that require authentication
- Error Response: Require authentication

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Authentication required"
    }
    ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current user does not have the
correct role(s) or permission(s).

- Request: endpoints that require proper authorization
- Error Response: Require proper authorization

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Forbidden"
    }
    ```

### Get the Current User

Returns the information about the current user that is logged in.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /session
  - Body: none

- Successful Response when there is a logged in user

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

- Successful Response when there is no logged in user

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": null
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's
information.

- Require Authentication: false
- Request

  - Method: POST
  - Route path: /session
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "credential": "john.smith@gmail.com",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

- Error Response: Invalid credentials

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Invalid credentials"
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "credential": "Email or username is required",
        "password": "Password is required"
      }
    }
    ```

### Sign Up a User

Creates a new user, logs them in as the current user, and returns the current
user's information.

- Require Authentication: false
- Request

  - Method: POST
  - Route path: /users
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

- Error response: User already exists with the specified email or username

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already exists",
      "errors": {
        "email": "User with that email already exists",
        "username": "User with that username already exists"
      }
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "email": "Invalid email",
        "username": "Username is required"
      }
    }
    ```

## POSTS

### Get all posts

Returns all the posts.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: /posts
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Posts": [
        {
          "id": 1,
          "userId": 1,
          "image": "image url",
          "title": "Post title",
          "description": "Place where web developers are created",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "likes": 45,
          "commentCount": 15,
          "Comments": [
            {
                "id": 1,
                "userId": 1,
                "postId": 1,
                "comment": "This was an awesome post!",
                "createdAt": "2021-11-19 20:39:36",
                "updatedAt": "2021-11-19 20:39:36" ,
            }
          ]
        }
      ]
    }
    ```

### Get all posts owned by the Current User

Returns all the posts owned (created) by the current user.

* Require Authentication: true
* Request
  * Method: GET
  * Route path: /posts/current
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Posts": [
        {
          "id": 1,
          "userId": 1,
          "image": "image url",
          "title": "Post title",
          "description": "Place where web developers are created",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "likes": 45,
          "commentCount": 12,
          "Comments": [
            {
                "id": 1,
                "userId": 1,
                "postId": 1,
                "comment": "This was an awesome post!",
                "createdAt": "2021-11-19 20:39:36",
                "updatedAt": "2021-11-19 20:39:36" ,
            }
          ]
        }
      ]
    }
    ```

### Get details of a Post from an id

Returns the details of a post specified by its id.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: /posts/:postId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
          "id": 1,
          "userId": 1,
          "image": "image url",
          "title": "Post title",
          "description": "Place where web developers are created",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "likes": 45,
          "commentCount": 12,
          "Comments": [
            {
                "id": 1,
                "userId": 1,
                "postId": 1,
                "comment": "This was an awesome post!",
                "createdAt": "2021-11-19 20:39:36",
                "updatedAt": "2021-11-19 20:39:36" ,
            }
          ]
    }
    ```

* Error response: Couldn't find a post with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "post couldn't be found"
    }
    ```

### Create a post

Creates and returns a new post.

* Require Authentication: true
* Request
  * Method: POST
  * Route path: /posts/create
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
          "image": "image url",
          "description": "Place where web developers are created",
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "image": "image url",
      "description": "Place where web developers are created",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "image": "Image is required",
        "description": "Description is required",
      }
    }
    ```

### Edit a post

Updates and returns an existing post.

* Require Authentication: true
* Require proper authorization: post must belong to the current user
* Request
  * Method: PUT
  * Route path: posts/:postId/update
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "image": "image url",
      "description": "Place where web developers are created"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "image": "image url",
      "description": "Place where web developers are created",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "image": "Image is required",
        "description": "Description is required",
      }
    }
    ```

* Error response: Couldn't find a post with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "post couldn't be found"
    }
    ```

### Delete a post

Deletes an existing post.

* Require Authentication: true
* Require proper authorization: post must belong to the current user
* Request
  * Method: DELETE
  * Route path: posts/:postId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

* Error response: Couldn't find a post with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "post couldn't be found"
    }
    ```

## COMMENTS

### Get all Comments of the Current User

Returns all the comments written by the current user.

* Require Authentication: true
* Request
  * Method: GET
  * Route path: /comments/current
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Comments": [
        {
          "id": 1,
          "userId": 1,
          "postId": 1,
          "comment": "This was an awesome post!",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36" ,
          "User": {
            "id": 1,
            "userName": "PuppyLover",
          },
          "Post": {
            "id": 1,
            "userId": 1,
            "image": "image url",
            "title": " Post title",
            "description": "Place where web developers are created",
            "createdAt": "2021-11-19 20:39:36",
            "updatedAt": "2021-11-19 20:39:36"
          },
        }
      ]
    }
    ```

### Get all comments by a post's id

Returns all the comments that belong to a post specified by id.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: /posts/:postId/comments
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "comments": [
        {
          "id": 1,
          "userId": 1,
          "postId": 1,
          "comment": "This was an awesome post!",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36" ,
          "User": {
            "id": 1,
            "userName": "CatLover"
          },
        }
      ]
    }
    ```

* Error response: Couldn't find a post with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "post couldn't be found"
    }
    ```

### Create a comment for a post based on the post's id

Create and return a new comment for a post specified by id.

* Require Authentication: true
* Request
  * Method: POST
  * Route path: /posts/:postId/comments
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "comment": "This was an awesome post!",
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "postId": 1,
      "comment": "This was an awesome post!",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "comment": "comment text is required",
      }
    }
    ```

* Error response: Couldn't find a post with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "post couldn't be found"
    }
    ```

### Edit a comment

Update and return an existing comment.

* Require Authentication: true
* Require proper authorization: comment must belong to the current user
* Request
  * Method: PUT
  * Route path: /comments/:commentId
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "comment": "This was an awesome post!"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "postId": 1,
      "comment": "This was an awesome post!",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-20 10:06:40"
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "comment": "comment text is required"
      }
    }
    ```

* Error response: Couldn't find a comment with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "comment couldn't be found"
    }
    ```

### Delete a comment

Delete an existing comment.

* Require Authentication: true
* Require proper authorization: comment must belong to the current user
* Request
  * Method: DELETE
  * Route path: comments/:commentId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

* Error response: Couldn't find a comment with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "comment couldn't be found"
    }
    ```

## LIKES

### Get all Likes on a Post

Returns all likes on a specific post.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /posts/:postId/likes
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "likes": [
        {
          "id": 1,
          "userId": 2,
          "postId": 3,
          "text": "I love this post!",
          "createdAt": "2024-12-17 20:39:36",
          "updatedAt": "2024-12-17 20:39:36"
        }
      ]
    }
    ```

### Like a Post

Allows a user to like a specific post.

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /posts/:postId/likes
  - Body: 
  
      ```json
    {
      "text": "Your post is inspiring!"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 10,
      "userId": 1,
      "postId": 3,
      "text": "Your post is inspiring!",
      "createdAt": "2024-12-17 20:39:36",
      "updatedAt": "2024-12-17 20:39:36"
    }
    ```

- Error Response: Require authentication

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Authentication required"
    }
    ```

- Error Response: Couldn't find a Post with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Post not found"
    }
    ```

- Error Response: Bad request

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User has already liked this post"
    }
    ```     

### Update a Like

Allows a user to update the note associated with their like.

- Require Authentication: true
- Request

  - Method: PUT
  - Route path: /posts/:postId/likes/:likeId
  - Body:

    ```json
    { "text": "Updated note about the post." }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 10,
      "userId": 1,
      "postId": 3,
      "text": "Updated note about the post.",
      "createdAt": "2024-12-17 20:39:36",
      "updatedAt": "2024-12-17 20:39:36"
    }
    ```

- Error Response: Require authentication

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Authentication required"
    }
    ```

- Error Response: Couldn't find a Like with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Like not found"
    }
    ```    

### Unlike a Post

Allows a user to remove their like from a specific post.

- Require Authentication: true
- Request

  - Method: DELETE
  - Route path: /posts/:postId/likes/:likeId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    { "message": "Successfully unliked the post." }
    ```


## FOLLOWS

### Get all Followed Users

Returns a list of users that the current user is following.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /follows
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "following": [
        {
          "id": 1,
          "userId": 1,
          "followingId": 2,
          "text": "Great content creator!",
          "createdAt": "2024-12-17 20:39:36",
          "updatedAt": "2024-12-17 20:39:36"
        }
      ]
    }
    ```

### Follow Another User

Allows the current user to follow another user.

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /follows/:userId
  - Body:

    ```json
    {
      "text": "You inspire me!"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 5,
      "userId": 1,
      "followingId": 2,
      "text": "You inspire me!",
      "createdAt": "2024-12-17 20:39:36",
      "updatedAt": "2024-12-17 20:39:36"
    }
    ```

- Error Response: Require authentication

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Authentication required"
    }
    ```

- Error Response: Couldn't find a User with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User not found"
    }
    ```      

### Update a Follow Note

Allows the current user to update their note for a followed user.

- Require Authentication: true
- Request

  - Method: PUT
  - Route path: /follows/:userId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "text": "Updated follow note."
    }
    ```  

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 5,
      "userId": 1,
      "followingId": 2,
      "text": "Updated follow note.",
      "createdAt": "2024-12-17 20:39:36",
      "updatedAt": "2024-12-17 20:39:36"
    }
    ```

- Error Response: Require authentication

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Authentication required"
    }
    ```

- Error Response: Couldn't find a relationship between the specified users

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Follow relationship not found"
    }
    ```          

### Unfollow a User

Allows the current user to unfollow another user.

- Require Authentication: true
- Request

  - Method: DELETE
  - Route path: /follows/:userId
  - Headers:
    - Content-Type: application/json
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    { "message": "Successfully unfollowed the user." }
    ```
