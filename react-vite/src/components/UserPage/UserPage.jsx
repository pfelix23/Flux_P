import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkLoadLikes } from '../../redux/likes';
import LikeModal from '../LikeModal/LikeModal';
import CommentsModal from '../CommentsModal/CommentsModal';
import { FaRegHeart } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import './UserPage.css';

function UserPage() {
    const [posts, setPosts] = useState([]);
    const [errors, setErrors] = useState();
    const [fillHeart, setFillHeart] = useState('');
    const { setModalContent, closeModal } = useModal()
    const likes = useSelector((state) => state.likes);
    const { username } = useParams(); 
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        fetch(`/api/posts/users/${username}`)
            .then((res) => res.json())
            .then((data) => setPosts(data.Posts))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                    console.log(errors);
                }
            });
            dispatch(thunkLoadLikes());
    }, [username]);

    const fill_heart = (postId) => {
        setFillHeart(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }))
      } 
    
    const heart = (postId) => fillHeart[postId] ? <FaHeart /> : <FaRegHeart />

    return (
        <div className='posts_section'>
            <section className='posts_section'>
                {[...posts].reverse().map((post) => {

                    const like = Object.values(likes).find((like) => like.post_id === post.id);
                    const isLiked = !!like;
                    const likeId = like?.id || null;
                    const likeNote = like?.note || "";

                    const openLikesModal = () => {
                    setModalContent(<LikeModal postId={post.id} isLiked={isLiked} likeId={likeId} existingNote={likeNote} closeModal={closeModal}/>)
                    }

                    const openCommentModal = () => {
                    setModalContent(<CommentsModal postId={post.id} closeModal={closeModal}/>)
                    }
                    return (
                        <picture key={post.id} className='post_picture'>
                            <div className='user_info'>{username}</div>
                            <img
                                onClick={() => navigate(`/posts/${post.id}`)}
                                src={post.image}
                                alt={post.description}
                                className='posts_img'
                            />
                            <div className='added_info_div'>
                            <div className='description'>{post.description}</div>
                            <div className='likes_container'> 
                            <div className='heart_icon' onClick={(e) => {e.stopPropagation();fill_heart(post.id);{openLikesModal()}}}>{heart(post.id)}</div>
                            <div className='likes_count'>{post.likes}</div>
                            </div>
                            <div className='comment_container'>
                            <div className='comment_icon' onClick={(e) => {e.stopPropagation();openCommentModal()}}><FaRegCommentDots />
                            </div>
                            <div className='comment_count'>{post.comment_count}</div>
                            </div>
                            </div>
                        </picture>
                    );
                })}
            </section>
        </div>
    );
}

export default UserPage;