from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Follow, User, db
from app.forms import FollowForm

follow_routes = Blueprint('follows', __name__)

@follow_routes.route('/<int:user_id>', methods=['POST'])
@login_required
def create_follow(user_id):
    """
    Creates a follow
    """
    followed_user = User.query.get(user_id)
    if not followed_user:
        return jsonify({"error": "User not found"}), 404
    
    if current_user.id == user_id:
        return jsonify({"error": "You cannot follow yourself."}), 400
    
    existing_follow = Follow.query.filter_by(follower_id=current_user.id, following_id=user_id).first()
    if existing_follow:
        return jsonify({"error": "You are already following this user."}), 400

    form = FollowForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        follow = Follow(
            follower_id=current_user.id,
            following_id=user_id,
            note=form.data['note'] if form.data['note'] else ""
        )
        db.session.add(follow)
        db.session.commit()
        return jsonify(follow.to_dict()), 201
    
    return jsonify({"error": "Authentication required"}), 400


@follow_routes.route('/<int:user_id>', methods=['DELETE'])
@login_required
def delete_follow(user_id):
    """
    Deletes a follow
    """
    followed_user = User.query.get(user_id)
    if not followed_user:
        return jsonify({"error": "User not found"}), 404
    
    follow = Follow.query.filter_by(follower_id=current_user.id, following_id=user_id).first()
    if not follow:
        return jsonify({"error": "Follow relationship not found"}), 404
    
    db.session.delete(follow)
    db.session.commit()

    return jsonify({"message": "Successfully unfollowed the user"}), 200


@follow_routes.route('/<int:user_id>', methods=['PUT'])
@login_required
def update_follow(user_id):
    """
    Updates a follow note
    """
    followed_user = User.query.get(user_id)
    if not followed_user:
        return jsonify({"error": "User not found"}), 404
    
    follow = Follow.query.filter_by(follower_id=current_user.id, following_id=user_id).first()
    if not follow:
        return jsonify({"error": "Follow relationship not found"}), 404
    
    data = request.get_json()
    follow.note = data['note']
    db.session.commit()

    return jsonify(follow.to_dict()), 200


@follow_routes.route('/current', methods=['GET'])
@login_required
def get_following():
    """
    Returns a list of users that the current user is following
    """
    follows = Follow.query.filter_by(follower_id=current_user.id).order_by(Follow.created_at.desc()).all()
    return {'follows': [follow.to_dict() for follow in follows]}


@follow_routes.route('/<string:username>', methods=['GET'])
@login_required
def get_follow_data(username):
    """
    Checks if the current user is following by username and returns the follow note.
    """
    followed_user = User.query.filter_by(username=username).first()
    if not followed_user:
        return jsonify({"error": "User not found"}), 404

    existing_follow = Follow.query.filter_by(follower_id=current_user.id, following_id=followed_user.id).first()
    
    if existing_follow:
        return jsonify({
            "is_following": True,
            "note": existing_follow.note  
        }), 200
    else:
        return jsonify({
            "is_following": False,
            "note": ""
        }), 200
