from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Comment, db

comment_routes = Blueprint("comments", __name__)


@comment_routes.route("/current")
@login_required
def get_current_user_comments():
    comments = Comment.query.filter_by(user_id=current_user.id).order_by(Comment.created_at.desc()).all()

    comments_data = [
        {
            "id": comment.id,
            "user_id": comment.user_id,
            "post_id": comment.post_id,
            "comment": comment.comment,
            "created_at": comment.created_at,
            "updated_at": comment.updated_at,
        }
        for comment in comments
    ]

    return jsonify({"Comments": comments_data}), 200


@comment_routes.route("/<int:comment_id>", methods=["PUT"])
@login_required
def edit_comment(comment_id):
    data = request.get_json()
    comment_text = data.get("comment")

    if not comment_text:
        return jsonify({"error": "Comment text is required"}), 400

    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"error": "Comment couldn't be found"}), 404

    if comment.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    comment.comment = comment_text
    db.session.commit()

    return jsonify(comment.to_dict()), 200


@comment_routes.route("/<int:comment_id>", methods=["DELETE"])
@login_required
def delete_comment(comment_id):
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"error": "Comment couldn't be found"}), 404

    if comment.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"message": "Comment deleted successfully"}), 200