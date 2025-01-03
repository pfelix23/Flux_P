import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { FaRegHeart, FaRegCommentDots, FaHeart, FaCog } from "react-icons/fa";
import { thunkLoadLikes } from '../../redux/likes';
import { thunkLoadFollows } from '../../redux/follows';
import LikeModal from '../LikeModal/LikeModal';
import CommentsModal from '../CommentsModal/CommentsModal';
import FollowModal from '../FollowModal/FollowModal';
import PostModal from '../PostModal/PostModal';
import { useModal } from '../../context/Modal';
import './LandingPager.css';
function LandingPager() {
    const [posts, setPosts] = useState([]);
    const [sessionPosts, setSessionPosts] = useState([])
    const [users, setUsers] = useState();
    const [errors, setErrors] = useState();
    const [view, setView] = useState('all');
    const [fillHeart, setFillHeart] = useState('');
    const [isActive, setIsActive] = useState('all')
    const { setModalContent, closeModal } = useModal()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user)
    const likes = useSelector((state) => state.likes);
    const follows = useSelector((state) => state.follows);

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
        dispatch(thunkLoadFollows());    
        dispatch(thunkLoadLikes());
    }, [errors, dispatch]);

    const refreshPosts = async () => {
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
        dispatch(thunkLoadFollows());    
        dispatch(thunkLoadLikes());
    };

    useEffect(() => {
        fetch('/api/posts/followed_posts')
        .then((res) => res.json())
        .then((data) => setSessionPosts(data.Posts))
        .catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
                console.log(errors)
            }
        })
    }, [sessionUser, errors]);
    
    useEffect(() => {
        fetch('/api/users/others')
        .then((res) => res.json())
        .then((data) => setUsers(data.Users))
        .catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
                console.log(errors)
            }
        })
    }, [sessionUser, errors]); 
    
    const switchView = (viewType) => {
        setView(viewType)
        setIsActive(viewType)
    }

    const fill_heart = (postId) => {
        setFillHeart(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }))
    }

    const heart = (postId) => fillHeart[postId] ? <FaHeart /> : <FaRegHeart />

    const display = sessionUser ? (view === "all" ? posts : sessionPosts) : posts;

    return (
        <div className='posts_section'>
            <section className='posts_section_2'>
                {sessionUser && (
                    <div className='landing_page_button_container'>
                    <div className={`landing_page_button ${isActive === 'all' ? 'active' : ''}`}
                    onClick={() => switchView('all')}>All Posts</div>
                    <div className={`landing_page_button ${isActive === 'following' ? 'active' : ''}`}
                    onClick={() => switchView('following')}>Following</div>
                    </div>                    
                )}
                {[...display].map((post) => {
                    const like = Object.values(likes).find((like) => like.post_id === post.id);
                    const isLiked = !!like;
                    const likeId = like?.id || null;
                    const likeNote = like?.note || "";

                    const follow = follows[post.user_id];
                    const isFollowing = !!follow;
                    const followId = follow?.id || null;
                    const followNote = follow?.note || "";

                    const handleClick = () => {
                        if(sessionUser && sessionUser.id === post.id) {
                            navigate(`/posts/${post.id}`)
                        } else if(sessionUser && sessionUser.id !== post.id) {
                            navigate('/')
                        } else navigate('/signup')
                    }
                    const handleUser = () => {
                      const user = users?.find((user) => user.id === post.user_id);
                        if(user) {
                        return user.username
                      }
                    }

                    // const isFollowing = sessionPosts.some((sessionPost) => sessionPost.id === post.id);

                    const openLikesModal = () => {
                        setModalContent(<LikeModal postId={post.id} isLiked={isLiked} likeId={likeId} existingNote={likeNote} closeModal={closeModal}/>)
                    }

                    const openCommentModal = () => {
                        setModalContent(<CommentsModal postId={post.id} closeModal={closeModal}/>)
                    }

                    const openFollowModal = () => {
                        setModalContent(<FollowModal postId={post.id} userId={post.user_id} isFollowing={isFollowing} followId={followId} existingNote={followNote} closeModal={closeModal}/>)
                    }

                    const openPostModal = () => {
                        setModalContent(<PostModal postId={post.id} existingTitle={post.title} existingDescription={post.description} closeModal={closeModal} refreshPosts={refreshPosts} />)
                    }                

                    return (
                        <picture key={post.id} className='post_container'>
                            <div className='user_info'>{handleUser()} {sessionUser && sessionUser.id !== post.user_id && (<div className='follow_text' onClick={(e) => {e.stopPropagation(); {openFollowModal()}}}>{isFollowing ? 'Following' : 'Follow'}</div>)}</div>
                            <img src={post.image} alt={post.description} className='posts_img' onClick={handleClick} />
                            <div className='added_info_div'>
                            <div className='description'>{post.description}</div>
                            {sessionUser && sessionUser.id === post.user_id && (
                                <div className='manage_like_container'>
                                 <div className='manage_like_icon' onClick={(e) => {e.stopPropagation();openPostModal()}}><FaCog /></div>
                                </div>
                            )}
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
                })
              }
            </section>
        </div>
    )
}
export default LandingPager