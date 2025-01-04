import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkLoadLikes } from '../../redux/likes';
import LikeModal from '../LikeModal/LikeModal';
import CommentsModal from '../CommentsModal/CommentsModal';
import FollowModal from '../FollowModal/FollowModal';
import { FaRegHeart } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import './UserPage.css';

function UserPage() {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followNote, setFollowNote] = useState("");
    const [errors, setErrors] = useState();
    const navigate = useNavigate();
    const { username } = useParams();
    const [fillHeart, setFillHeart] = useState('');
    const { setModalContent, closeModal } = useModal()
    const likes = useSelector((state) => state.likes);
    const dispatch = useDispatch();

    useEffect(() => {
        fetch(`/api/users/${username}`)
            .then((res) => res.json())
            .then((data) => setUser(data))
            .catch((err) => {
                setErrors(err.message);
                console.log(err);
            });

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

        fetch(`/api/follows/${username}`)
            .then((res) => res.json())
            .then((data) => {
                setIsFollowing(data.is_following);
                setFollowNote(data.note);
            })
            .catch((err) => {
                setErrors(err.message);
                console.log(err);
            });

    }, [username, dispatch, errors]);

    const refreshFollows = () => {
        fetch(`/api/follows/${username}`)
            .then((res) => res.json())
            .then((data) => {
                setIsFollowing(data.is_following);
                setFollowNote(data.note); 
            })
            .catch((err) => {
                setErrors(err.message);
                console.log(err);
            });
    };

    const fill_heart = (postId) => {
        setFillHeart(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }))
      } 

    const heart = (postId) => fillHeart[postId] ? <FaHeart /> : <FaRegHeart />

    return (
        <div className="posts_section">
            <div className='header'>
            <h1 style={{marginLeft:'5%', marginBottom:'-.25%'}}>{username}&apos;s page</h1>
            <div className='follow_div'>
            <div id='follow_container'>
            {user && (
                <OpenModalMenuItem
                    itemText={isFollowing ? "Manage Follow" : "Follow"}
                    modalComponent={
                        <FollowModal
                            userId={user.id}
                            isFollowing={isFollowing}
                            existingNote={followNote}
                            refreshFollows={refreshFollows}
                        />
                    }
                />
            )}
            </div>
            <div id='followNote'>{followNote}</div>
            </div>
            {/* <div>{followNote}</div> */}
            </div>

            {posts.length === 0 ? (
                <p>This user has not made any posts.</p>
            ) : (
                <section className="posts_section">
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
                                <div className='user_info'>{post.username}</div>
                                <img
                                    onClick={() => navigate(`/posts/${post.id}`)}
                                    src={post.image}
                                    alt={post.description}
                                    className="posts_img"
                                />
                                <div className="added_info_container">
                                    <div className='description'>{post.description}</div>
                                    <div className='likes_container'> 
                                        <div className='heart_icon' onClick={(e) => {e.stopPropagation();fill_heart(post.id);{openLikesModal()}}}>{heart(post.id)}</div>
                                        <div className='likes_count'>{post.likes}</div>
                                    </div>
                                    <div className='comment_container'>
                                        <div className='comment_icon' onClick={(e) => {e.stopPropagation();openCommentModal()}}><FaRegCommentDots /></div>
                                        <div className='comment_count'>{post.comment_count}</div>
                                    </div>
                                </div>
                            </picture>
                        );
                    })}
                </section>
            )}
        </div>
    );
}

export default UserPage;
