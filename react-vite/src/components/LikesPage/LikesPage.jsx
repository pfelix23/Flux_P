import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { FaRegHeart } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { thunkLoadLikes } from '../../redux/likes';
import { thunkLoadFollows } from '../../redux/follows';
import LikeModal from '../LikeModal/LikeModal';
import CommentsModal from '../CommentsModal/CommentsModal';
import FollowModal from '../FollowModal/FollowModal';
import { useModal } from '../../context/Modal';
import './LikesPage.css';
// import LikeModal from '../LikeModal/LikeModal';


function LikesPage() {
    const [likes, setLikes] = useState([]);
    const [errors, setErrors] = useState();
    const [fillHeart, setFillHeart] = useState('');
    const { setModalContent, closeModal } = useModal()
    const liked = useSelector((state) => state.likes);
    const follows = useSelector((state) => state.follows);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        dispatch(thunkLoadFollows());    
        dispatch(thunkLoadLikes());
    }, [dispatch, errors]);

    const fill_heart = (postId) => {
        setFillHeart(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }))
    }

    const heart = (postId) => fillHeart[postId] ? <FaHeart /> : <FaRegHeart />

    console.log([...Object.entries(follows)])

    return (
        <div className='posts_section'>
            <section className='posts_section_2'>
            <div className='h1_container'><h1 id='h1'>Likes</h1></div>
                {likes.reverse().map((like) => {
                    const like_ = Object.values(liked).find((like) => like.post_id === like.id);
                    const isLiked = !!like_;
                    const likeId = like_?.id || null;
                    const likeNote = like_?.note || "";

                    const follow = follows[like.user_id];
                    const followId = follow?.id || null;
                    const followNote = follow?.note || "";

                    const isFollowing = [...Object.entries(follows)][1].some((sessionPost) => sessionPost.id === like.id);

                    const openLikesModal = () => {
                        setModalContent(<LikeModal postId={like.id} isLiked={isLiked} likeId={likeId} existingNote={likeNote} closeModal={closeModal}/>)
                    }

                    const openCommentModal = () => {
                        setModalContent(<CommentsModal postId={like.id} closeModal={closeModal}/>)
                    }

                    const openFollowModal = () => {
                        setModalContent(<FollowModal postId={like.id} userId={like.user_id} isFollowing={isFollowing} followId={followId} existingNote={followNote} closeModal={closeModal}/>)
                    }

                    return (
                        <div key={like.post} className='post_container'>
                            <div className='user_info'><a href={`/${like.poster_username}`} id='user_a_tag'>{like.poster_username}</a></div>
                            <img onClick={() => navigate(`/posts/${like.post_id}`)} src={like.image} alt={like.description} className='likes_img'></img>
                            <div className='added_info_div'>
                            <div className='description'>{like.description}</div>
                            <div className='likes_container'>
                            <div className='heart_icon' onClick={(e) => {e.stopPropagation();fill_heart(like.id);{openLikesModal()}}}>{heart(like.id)}</div>
                            <div className='likes_count'>{like.likes_count}</div>
                            </div>
                            <div className='note_container'>
                            <div className='note_icon' onClick={(e) => {e.stopPropagation();openCommentModal()}}><FaRegCommentDots />
                            </div>
                            <div className='note'>{like.note}</div>
                            </div>
                            </div>                           
                        </div>
                    );
                })

              }

            </section>

        </div>
    )

}

export default LikesPage