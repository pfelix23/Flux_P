import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { thunkLoadLikes } from '../../redux/likes';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LikeModal from '../LikeModal/LikeModal';
import './LandingPage.css';

function LandingPage() {
    const [posts, setPosts] = useState([]);
    const [errors, setErrors] = useState();
    const likes = useSelector((state) => state.likes);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        fetch('/api/posts')
            .then((res) => res.json())
            .then((data) => setPosts(data.Posts))
            .catch(async (res) => {
                const data = await res.json();
                if(data && data.errors) {
                    setErrors(data.errors);
                    console.log(errors)
                }
            })

        dispatch(thunkLoadLikes());
    }, [dispatch]);

    return (
        <div className='posts_section'>
            <section className='posts_section'>
                {[...posts].reverse().map((post) => {
                    const like = Object.values(likes).find((like) => like.post_id === post.id);
                    const isLiked = !!like; 
                    const likeId = like?.id || null; 
                    const note = like?.note || ""; 

                    return (
                        <picture onClick={() => navigate(`/api/posts/${post.id}`)} key={post.id}>
                            <img src={post.image} alt={post.description} className='posts_img' />
                            <div className='added_info'>
                                <div>{post.description}</div>
                                <div>{post.likes}</div>
                                <div>{post.comment_count}</div>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                                <OpenModalButton
                                    modalComponent={
                                        <LikeModal
                                            postId={post.id}
                                            isLiked={isLiked}
                                            likeId={likeId}
                                            existingNote={note}
                                        />
                                    }
                                    buttonText={isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
                                />
                            </div>
                        </picture>
                    );
                })
              }
            </section>
        </div>
    )
}

export default LandingPage
