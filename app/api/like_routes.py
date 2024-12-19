from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app import db
from app.models import Post, Like, Comment, db

like_routes = Blueprint('likes', __name__)

@like_routes.route('/posts/<int:post_id>/likes')
def likes():
    
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404
    
    likes = Like.query.filter_by(post_id = post.id)

    likes_data = []

    for like in likes:

        likes_data.append({
            "id": like.id,
            "likes_id": like.like_id,
            "post_id": like.post_id,
            "text": like.text,
            "created_at": like.created_at,
            "updated_at": like.updated_at
        })

    return jsonify({'likes': likes_data}) , 200

@like_routes.route('/posts/<int:post_id>/likes', methods = ['POST'])
@login_required
def like_post(post_id):

    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404

    liked_already = Like.query.filter_by(post_id=post.id, user_id=current_user.id).first()
    if liked_already:
        return jsonify({"message": "User has already liked this post"}), 400
    
    like = Like(
        user_id=current_user.id,
        post_id=post.id,
        text=request.json.get('text', '')
    )

    db.session.add(like)
    db.session.commit()

    response_data = {
    "id": like.id,
    "user_id": like.user_id,
    "post_id": like.post_id,
    "text": like.text,
    "created_at": like.created_at,
    "updated_at": like.updated_at
    }

    return jsonify(response_data), 201

@like_routes.route('/posts/<int:post_id>/likes/<int:like_id>', methods = ['PUT'])
@login_required
def like_update(post_id, like_id):
    
    data = request.get_json()
    
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404

    like = Like.query.get(like_id)
    if not like:
        return jsonify({"message": "Like not found"}), 404
    
    if like.user_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403

    like.text = data.get("text", "")

    db.session.commit()

    return jsonify({
        "id": like.id,
        "user_id": like.user_id,
        "post_id": like.post_id,
        "text": like.text,
        "created_at": like.created_at,
        "updated_at": like.updated_at
    })

@like_routes.route('/posts/<int:post_id>/likes/<int:like_id>', methods = ['DELETE'])
@login_required
def unlike(post_id, like_id):

    like = Like.query.get(like_id)
    if not like:
        return jsonify({"message": "Like not found"}), 404

    db.session.delete(like)
    db.session.commit()

    return jsonify({"message": "Successfully unliked the post."})
