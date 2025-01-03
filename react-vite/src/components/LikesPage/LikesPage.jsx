import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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

function LikesPage() {
    const [likes, setLikes] = useState([]);
    const [errors, setErrors] = useState();
    const [fillHeart, setFillHeart] = useState('');
    const { setModalContent, closeModal } = useModal();
    const [followStatus, setFollowStatus] = useState({});
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
                console.log(errors);
            }
        });

        dispatch(thunkLoadFollows());    
        dispatch(thunkLoadLikes());
    }, [dispatch, errors]);


    const checkFollowStatus = async (username) => {
        try {
            const response = await fetch(`/api/follows/${username}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching follow status:", error);
            return { is_following: false, note: "" };
        }
    };

    useEffect(() => {
        const loadFollowStatus = async () => {
            const status = {};
            for (const like of likes) {
                const { is_following, note } = await checkFollowStatus(like.poster_username);
                status[like.poster_username] = { is_following, note };
            }
            setFollowStatus(status);
        };
        if (likes.length > 0) loadFollowStatus();
    }, [likes]);

    const fill_heart = (postId) => {
        setFillHeart(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const heart = (postId) => fillHeart[postId] ? <FaHeart /> : <FaRegHeart />;

    
    const refreshFollows = async () => {
        const updatedFollowStatus = {};
        for (const like of likes) {
            const { is_following, note } = await checkFollowStatus(like.poster_username);
            updatedFollowStatus[like.poster_username] = { is_following, note };
        }
        setFollowStatus(updatedFollowStatus);
    };
    
    const openFollowModal = (like) => {
        const userFollowStatus = followStatus[like.poster_username] || { is_following: false, note: "" }; 
        setModalContent(
            <FollowModal 
                userId={like.poster_id} 
                isFollowing={userFollowStatus.is_following}
                existingNote={userFollowStatus.note} 
                refreshFollows={refreshFollows}
            />
        );
    };

    return (
        <div className='posts_section'>
            <section className='posts_section_2'>
            <div className='h1_container'><h1 id='h1'>Likes</h1></div>
                {likes.length === 0 ? (
                    <p>You have not liked any posts.</p> 
                ) : (
                    [...likes].reverse().map((like) => {
                        const openLikesModal = () => {
                            setModalContent(<LikeModal postId={like.id} isLiked={true} likeId={like.id} existingNote={like.note} closeModal={closeModal} refreshLikes={dispatch(thunkLoadLikes)}/>);
                        };

                        const openCommentModal = () => {
                            setModalContent(<CommentsModal postId={like.post_id} closeModal={closeModal}/>);
                        };

                        const followButton = followStatus[like.poster_username]?.is_following ? "Manage Follow" : "Follow";

                        return (
                            <div key={like.post} className='post_container'>
                                <div className='user_info'>
                                    <a href={`/${like.poster_username}`} id='user_a_tag'>{like.poster_username}</a>
                                    <button onClick={() => openFollowModal(like)}>{followButton}</button>
                                </div>
                                <img 
                                    onClick={() => navigate(`/posts/${like.post_id}`)} 
                                    src={like.image} 
                                    alt={like.description} 
                                    className='likes_img'
                                />
                                <div className='added_info_div'>
                                    <div className='description'>{like.description}</div>
                                    <div className='likes_container'>
                                        <div className='heart_icon' onClick={(e) => {e.stopPropagation(); fill_heart(like.id); openLikesModal()}}>{heart(like.id)}</div>
                                        <div className='likes_count'>{like.likes_count}</div>
                                    </div>
                                    <div className='note_container'>
                                        <div className='note_icon' onClick={(e) => {e.stopPropagation(); openCommentModal()}}><FaRegCommentDots /></div>
                                        <div className='note'>{like.note}</div>
                                    </div>
                                </div>     
                            </div>
                        );
                    })
                )}
            </section>
        </div>
    );
}

export default LikesPage;
