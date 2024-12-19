from app.models import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text


def seed_comments():
    seed_data = [
        Comment(
            user_id=1,
            post_id=1,
            comment="This view is absolutely stunning!"
        ),
        Comment(
            user_id=2,
            post_id=1,
            comment="I wish I could see this in person."
        ),
        Comment(
            user_id=3,
            post_id=3,
            comment="I love hiking through trails like this!"
        ),
        Comment(
            user_id=4,
            post_id=4,
            comment="The ocean always makes me feel at peace."
        ),
        Comment(
            user_id=5,
            post_id=5,
            comment="Winter is such a magical season."
        ),
        Comment(
            user_id=1,
            post_id=6,
            comment="Autumn is my favorite time of year."
        ),
        Comment(
            user_id=2,
            post_id=7,
            comment="I can almost feel the warmth of the sand."
        ),
        Comment(
            user_id=3,
            post_id=9,
            comment="These flowers are so vibrant!"
        ),
        Comment(
            user_id=4,
            post_id=9,
            comment="Spring is truly the best season."
        ),
        Comment(
            user_id=5,
            post_id=10,
            comment="The stars look so beautiful tonight."
        )
    ]

    db.session.bulk_save_objects(seed_data)
    db.session.commit()

def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))
        
    db.session.commit()
