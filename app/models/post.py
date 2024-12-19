from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func

class Post(db.Model):
    __tablename__ = 'posts'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    image = db.Column(db.String, nullable=False)
    title = db.Column(db.String(50), nullable=True)
    description = db.Column(db.Text, nullable=False)
    likes_count = db.Column(db.Integer, default=0, nullable=False)
    comments_count = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, onupdate=func.now(), nullable=False)

    user = db.relationship("User", back_populates="posts")
    comments = db.relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    likes = db.relationship("Like", back_populates="post", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "image": self.image,
            "title": self.title,
            "description": self.description,
            "likes_count": self.likes_count,
            "comments_count": self.comments_count,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
