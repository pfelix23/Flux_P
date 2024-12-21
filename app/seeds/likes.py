from app.models import db, Like, environment, SCHEMA
from sqlalchemy.sql import text


def seed_likes():
    seed_data = [
        Like(
            user_id=2,
            post_id=1,
            note="Such an inspiring photo!"
        ),
        Like(
            user_id=3,
            post_id=1
        ),
        Like(
            user_id=1,
            post_id=2,
            note="Amazing night view!"
        ),
        Like(
            user_id=4,
            post_id=3
        ),
        Like(
            user_id=5,
            post_id=4,
            note="I feel so calm looking at this."
        ),
        Like(
            user_id=3,
            post_id=5
        ),
        Like(
            user_id=4,
            post_id=6,
            note="The colors of autumn are breathtaking."
        ),
        Like(
            user_id=5,
            post_id=7
        ),
        Like(
            user_id=1,
            post_id=9
        ),
        Like(
            user_id=2,
            post_id=10,
            note="This looks so peaceful."
        )
    ]

    db.session.bulk_save_objects(seed_data)
    db.session.commit()

def undo_likes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.likes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM likes"))
        
    db.session.commit()
