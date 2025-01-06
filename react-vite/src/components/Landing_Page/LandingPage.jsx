import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { thunkLoadLikes } from '../../redux/likes';
import { thunkLoadFollows } from '../../redux/follows';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LikeModal from '../LikeModal/LikeModal';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import CommentsModal from '../CommentsModal/CommentsModal';
import FollowModal from '../FollowModal/FollowModal';
import { useModal } from '../../context/Modal';
import './LandingPage.css';

function LandingPage() {
    const [posts, setPosts] = useState([]);
    const [sessionPosts, setSessionPosts] = useState([])
    const [users, setUsers] = useState();
    const [errors, setErrors] = useState();
    const [view, setView] = useState('all');
    const { setModalContent } = useModal();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
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
                }
            })

        dispatch(thunkLoadFollows());    
        dispatch(thunkLoadLikes());
    }, [dispatch]);

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
    }

    const display = sessionUser ? (view === "all" ? posts : sessionPosts) : posts;

    return (
        <div className='posts_section'>
            <section className='posts_section_2'>
                {sessionUser && (
                    <div className='landing_page_button_container'>
                    <div className='landing_page_button'
                    onClick={() => switchView('all')}>All Posts</div>
                    <div className='landing_page_button'
                    onClick={() => switchView('following')}>Following</div>
                    </div>                    
                )}
                {display.reverse().map((post) => {

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
                        if(user && (!sessionUser || user.id !== sessionUser.id)) {
                          return user.username
                        }
                    }
                    
                    return (
                        <picture onClick={handleClick} key={post.id} className='post_container'>
                            <div className='user_info'>
                                {handleUser()} 
                                {sessionUser && sessionUser.id !== post.user_id && (
                                    <span className='follow_text' onClick={(e) => {
                                        e.stopPropagation();
                                        setModalContent(
                                            <FollowModal
                                                userId={post.user_id}
                                                isFollowing={isFollowing}
                                                followId={followId}
                                                existingNote={followNote}
                                            />
                                        );
                                    }}>
                                        {isFollowing ? "Following" : "Follow"}
                                    </span>
                                )}
                            </div>
                            <img src={post.image} alt={post.description} className='posts_img' />
                            <div className='added_info_div'>
                            <div className='description'>{post.description}</div>
                            <div className='likes_container'> 
                            <div className='heart_icon' onClick={(e) => e.stopPropagation()}>
                                        <OpenModalButton
                                            modalComponent={
                                                <LikeModal
                                                    postId={post.id}
                                                    isLiked={isLiked}
                                                    likeId={likeId}
                                                    existingNote={likeNote}
                                                />
                                            }
                                            buttonText={
                                                isLiked ? <FaHeart color="red" /> : <FaRegHeart />
                                            }
                                        />
                                    </div>
                            <div className='likes_count'>{post.likes}</div>
                            </div>
                            <div className='added_info'>{post.comment_count}</div>
                            <OpenModalMenuItem
                                itemText="💬"
                                modalComponent={<CommentsModal postId={post.id}/>}
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