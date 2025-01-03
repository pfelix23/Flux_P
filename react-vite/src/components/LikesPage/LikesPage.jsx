import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './LikesPage.css';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import CommentsModal from '../CommentsModal/CommentsModal';
import LikeModal from '../LikeModal/LikeModal';


function LikesPage() {
    const [likes, setLikes] = useState([]);
    const [errors, setErrors] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/likes/current')
        .then((res) => res.json())
        .then((data) => setLikes(data.likes))
        .catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
                console.log(errors)
            }
        })
    }, []);

    const refreshLikes = () => {
        fetch('/api/likes/current')
            .then((res) => res.json())
            .then((data) => setLikes(data.likes))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                    console.log(errors);
                }
            });
    };

    return (
        <div className='posts_section'>
            <section className='posts_section'>
            <h1>Likes</h1>
                {likes.reverse().map((like) => {
                    return (
                        <div key={like.post}>
                            <div><a href={`/${like.poster_username}`}>{like.poster_username}</a></div>
                            <img onClick={() => navigate(`/posts/${like.post_id}`)} src={like.image} alt={like.description} className='likes_img'></img>
                            <div>{like.description}</div>
                            <div>{like.likes}</div>
                            <div>{like.note}</div>
                            <OpenModalMenuItem
                            itemText="💬"
                            modalComponent={<CommentsModal postId={like.post_id}/>}
                            />
                            <OpenModalMenuItem
                            itemText="Manage"
                            modalComponent={<LikeModal
                                postId={like.post_id}
                                isLiked={true}
                                likeId={like.id}
                                existingNote={like.note}
                                refreshLikes={refreshLikes}
                                />}
                            /> 
                        </div>
                    );
                })

              }

            </section>

        </div>
    )

}

export default LikesPage