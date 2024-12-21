from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Like, db

like_routes = Blueprint('likes', __name__)


@like_routes.route('/current')
@login_required
def get_current_user_likes():
    likes = Like.query.filter_by(user_id=current_user.id).order_by(Like.created_at.desc()).all()
    return jsonify({"likes": [like.to_dict() for like in likes]}), 200


@like_routes.route('/<int:like_id>', methods=['PUT'])
@login_required
def update_like_note(like_id):
    like = Like.query.get(like_id)

    if not like:
        return jsonify({"error": "Like not found"}), 404

    if like.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    like.note = data.get("note", "")

    db.session.commit()

    return jsonify(like.to_dict()), 200


@like_routes.route('/<int:like_id>', methods=['DELETE'])
@login_required
def unlike(like_id):
    like = Like.query.get(like_id)

    if not like:
        return jsonify({"error": "Like not found"}), 404

    if like.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(like)
    db.session.commit()

    return jsonify({"message": "Successfully unliked the post."}), 200
