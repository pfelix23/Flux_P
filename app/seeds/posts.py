from app.models import db, Post, environment, SCHEMA
from sqlalchemy.sql import text


def seed_posts():
    seed_data = [
        Post(
            user_id=1,
            image="https://a0.muscache.com/im/ml/photo_enhancement/pictures/miso/Hosting-959493006014888753/original/6e4e417f-25e3-4578-941e-42fdd68a3971.jpeg?im_w=1200&im_format=avif",
            title="Sunset View",
            description="A beautiful sunset over the mountains."
        ),
        Post(
            user_id=2,
            image="https://example.com/image2.jpg",
            description="The city shines bright at night."
        ),
        Post(
            user_id=3,
            image="https://example.com/image3.jpg",
            title="Forest Trail",
            description="An adventurous trail through the dense forest."
        ),
        Post(
            user_id=4,
            image="https://example.com/image4.jpg",
            title="Ocean Breeze",
            description="Feel the calmness of the ocean."
        ),
        Post(
            user_id=5,
            image="https://example.com/image5.jpg",
            title="Winter Wonderland",
            description="A serene winter landscape."
        ),
        Post(
            user_id=1,
            image="https://example.com/image6.jpg",
            title="Autumn Leaves",
            description="The colors of autumn captured perfectly."
        ),
        Post(
            user_id=2,
            image="https://example.com/image7.jpg",
            description="Golden sands as far as the eye can see."
        ),
        Post(
            user_id=3,
            image="https://example.com/image8.jpg",
            description="The majesty of towering mountain peaks."
        ),
        Post(
            user_id=4,
            image="https://example.com/image9.jpg",
            title="Spring Blooms",
            description="Flowers blossoming under the spring sun."
        ),
        Post(
            user_id=5,
            image="https://example.com/image10.jpg",
            title="Night Sky",
            description="A starry night to marvel at."
        )
    ]

    db.session.bulk_save_objects(seed_data)
    db.session.commit()

def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts"))
        
    db.session.commit()
