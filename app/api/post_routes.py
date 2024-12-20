from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Post, Like, Comment, db

post_routes = Blueprint("posts", __name__)


@post_routes.route("/")
def posts():
    posts = Post.query.all()

    posts_data = []

    for post in posts:

        likes_count = Like.query.filter_by(post_id=post.id).count()

        comments = Comment.query.filter_by(post_id=post.id).all()

        posts_data.append(
            {
                "id": post.id,
                "user_id": post.user_id,
                "image": post.image,
                "title": post.title,
                "description": post.description,
                "created_at": post.created_at,
                "updated_at": post.updated_at,
                "likes": likes_count,
                "comment_count": len(comments),
                "Comments": [
                    {
                        "id": comment.id,
                        "user_id": comment.user_id,
                        "post_id": comment.post_id,
                        "comment": comment.comment,
                        "created_at": comment.created_at,
                        "updated_at": comment.updated_at,
                    }
                    for comment in comments
                ],
            }
        )

    return jsonify({"Posts": posts_data}), 200


@post_routes.route("/current")
@login_required
def user_posts():
    user_posts = Post.query.filter_by(user_id=current_user.id).all()

    posts_data = []

    for post in user_posts:

        likes_count = Like.query.filter_by(post_id=post.id).count()

        comments = Comment.query.filter_by(post_id=post.id).all()

        posts_data.append(
            {
                "id": post.id,
                "user_id": post.user_id,
                "image": post.image,
                "title": post.title,
                "description": post.description,
                "created_at": post.created_at,
                "updated_at": post.updated_at,
                "likes": likes_count,
                "comment_count": len(comments),
                "Comments": [
                    {
                        "id": comment.id,
                        "user_id": comment.user_id,
                        "post_id": comment.post_id,
                        "comment": comment.comment,
                        "created_at": comment.created_at,
                        "updated_at": comment.updated_at,
                    }
                    for comment in comments
                ],
            }
        )

    return jsonify({"Posts": posts_data}), 200


@post_routes.route("/<int:post_id>")
@login_required
def user_post(post_id):

    post = Post.query.get(post_id)

    likes_count = Like.query.filter_by(post_id=post_id).count()

    comments = Comment.query.filter_by(post_id=post_id).all()

    if not post:
        return jsonify({"error": "post couldn't be found"})

    return (
        jsonify(
            {
                "id": post.id,
                "user_id": post.user_id,
                "image": post.image,
                "title": post.title,
                "description": post.description,
                "created_at": post.created_at,
                "updated_at": post.updated_at,
                "likes": likes_count,
                "comment_count": len(comments),
                "Comments": [
                    {
                        "id": comment.id,
                        "user_id": comment.user_id,
                        "post_id": comment.post_id,
                        "comment": comment.comment,
                        "created_at": comment.created_at,
                        "updated_at": comment.updated_at,
                    }
                    for comment in comments
                ],
            }
        ),
        200,
    )


@post_routes.route("/create", methods=["POST"])
@login_required
def create_post():

    data = request.get_json()
    image = data.get("image")
    description = data.get("description")
    title = data.get("title")

    if not image or not description:
        return jsonify(
            {
                "message": "Bad Request",
                "errors": {
                    "image": "Image is required",
                    "description": "Description is required",
                },
            }
        )

    new_post = Post(
        user_id=current_user.id, image=image, description=description, title=title
    )

    db.session.add(new_post)
    db.session.commit()

    return jsonify(new_post.to_dict()), 201


@post_routes.route("/<int:post_id>/update", methods=["PUT"])
@login_required
def edit_post(post_id):

    data = request.get_json()

    post = Post.query.get(post_id)

    if not post:
        return jsonify({"error": "post couldn't be found"})

    image = data.get("image")
    description = data.get("description")
    title = data.get("title")

    if not image or not description:
        return jsonify(
            {
                "message": "Bad Request",
                "errors": {
                    "image": "Image is required",
                    "description": "Description is required",
                },
            }
        )

    post.image = image
    post.description = description
    post.title = title

    db.session.commit()

    return jsonify(post.to_dict())


@post_routes.route("/<int:post_id>", methods=["DELETE"])
@login_required
def delete_post(post_id):

    post = Post.query.get(post_id)

    if not post:
        return jsonify({"error": "post couldn't be found"})

    db.session.delete(post)
    db.session.commit()

    return jsonify({"message": "Successfully deleted"})
