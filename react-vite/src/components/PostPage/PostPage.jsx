import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkLoadLikes } from '../../redux/likes';
import LikeModal from '../LikeModal/LikeModal';
import CommentsModal from '../CommentsModal/CommentsModal';
import PostModal from '../PostModal/PostModal';
import { FaRegHeart, FaRegCommentDots, FaHeart } from "react-icons/fa";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import './PostPage.css';

function PostPage() {
    const [post, setPost] = useState([]);
    const [errors, setErrors] = useState();
    const [fillHeart, setFillHeart] = useState('');
    const { setModalContent, closeModal } = useModal();
    const [users, setUsers] = useState();
    const dispatch = useDispatch();
    const post_id_object = useParams();
    const post_id = post_id_object.post_id;
    const likes = useSelector((state) => state.likes);
    const sessionUser = useSelector((state) => state.session.user);
    const like = Object.values(likes).find((like) => like.post_id === post.id);
    const isLiked = !!like;
    const likeId = like?.id || null;
    const likeNote = like?.note || "";


    useEffect(() => {
        fetch(`/api/posts/${post_id}`)
        .then((res) => res.json())
        .then((data) => setPost(data))
        .catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
            }
        })   
        dispatch(thunkLoadLikes());
    }, [post_id, dispatch]);

    const refreshPosts = async () => {
        fetch(`/api/posts/${post_id}`)
        .then((res) => res.json())
        .then((data) => setPost(data))
        .catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
                console.log(errors)
            }
        })   
        dispatch(thunkLoadLikes());
    };

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

    const fill_heart = (postId) => {
        setFillHeart(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }))
    }

    const heart = (postId) => fillHeart[postId] ? <FaHeart /> : <FaRegHeart />

    const openLikesModal = () => {
        setModalContent(<LikeModal postId={post.id} isLiked={isLiked} likeId={likeId} existingNote={likeNote} closeModal={closeModal}/>)
    }

    const openCommentModal = () => {
        setModalContent(<CommentsModal postId={post.id} closeModal={closeModal}/>)
    }

    const openPostModal = () => {
        setModalContent(<PostModal postId={post.id} existingTitle={post.title} existingDescription={post.description} closeModal={closeModal} refreshPosts={refreshPosts} />)
      }

    const handleUser = () => {
    const user = users?.find((user) => user.id === post.user_id);
        if(user) {
        return user.username
    }
    }

    return (
        <div className='post_section'>
            <section className='post_section_2'>
                <picture className='post_picture'>
                <div className='user_info'> {handleUser()}
                    {sessionUser && sessionUser.id === post.user_id && (
                        <div className='comment_dots_container'>
                            <div className='comment_dots' onClick={(e) => {e.stopPropagation();openPostModal()}}><PiDotsThreeOutlineFill /></div>
                        </div>
                    )}</div>
                    <img src={post.image} alt={post.description} className='post_img' />
                    <div className='added_info_container'>
                    <div className='post_description'>{post.description}</div>
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
            </section>
            </div>
    )
}
export default PostPage