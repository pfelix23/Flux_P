from app.models import db, Follow, environment, SCHEMA
from sqlalchemy.sql import text


def seed_follows():
    seed_data = [
        Follow(
            follower_id=1,
            following_id=2,
            note="Great content creator!"
        ),
        Follow(
            follower_id=1,
            following_id=3
        ),
        Follow(
            follower_id=2,
            following_id=4,
            note="Inspired by their photography!"
        ),
        Follow(
            follower_id=3,
            following_id=5,
            note="Their posts are amazing."
        ),
        Follow(
            follower_id=4,
            following_id=1
        ),
        Follow(
            follower_id=4,
            following_id=3,
            note="Interesting thoughts shared."
        )
    ]

    db.session.bulk_save_objects(seed_data)
    db.session.commit()

def undo_follows():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.follows RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM follows"))
        
    db.session.commit()
