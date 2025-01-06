import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkLoadLikes } from '../../redux/likes';
import LikeModal from '../LikeModal/LikeModal';
import CommentsModal from '../CommentsModal/CommentsModal';
import PostModal from '../PostModal/PostModal';
import { FaRegHeart, FaRegCommentDots, FaHeart } from "react-icons/fa";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import "./ProfilePage.css";
function ProfilePage() {
  const [posts, setPosts] = useState([]);
  const [errors, setErrors] = useState();
  const [fillHeart, setFillHeart] = useState('');
  const { setModalContent, closeModal } = useModal()
  const likes = useSelector((state) => state.likes);
  const sessionUser = useSelector((state) => state.session.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    fetch("/api/posts/current")
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((data) => setPosts(data.Posts))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
          console.log(errors);
        }
      });
      dispatch(thunkLoadLikes());
  }, [errors, dispatch]);


  const refreshPosts = async () => {
    fetch("/api/posts/current")
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((data) => setPosts(data.Posts))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
          console.log(errors);
        }
      });
      dispatch(thunkLoadLikes());
  };


  const fill_heart = (postId) => {
    setFillHeart(prev => ({
        ...prev,
        [postId]: !prev[postId]
    }))
  } 

  const heart = (postId) => fillHeart[postId] ? <FaHeart /> : <FaRegHeart />

  return (
    <div className="posts_section_4">
      <section className="posts_section_3">
      <div id="h1_container"><h1 id="h1">{sessionUser.username}&apos;s profile</h1></div>
        {posts.length === 0 ? (
          <p id="no_posts">You do not have any posts.</p>
        ) : (
        [...posts].reverse().map((post) => {
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

          const openPostModal = () => {
            setModalContent(<PostModal postId={post.id} existingTitle={post.title} existingDescription={post.description} closeModal={closeModal} refreshPosts={refreshPosts} />)
          }


          return (
            <picture key={post.id} className="post_container">
              <div className='user_info'>{sessionUser.username}
              <div className='manage_post_icon' onClick={(e) => {e.stopPropagation();openPostModal()}}><PiDotsThreeOutlineFill /></div>
              </div>
              <img src={post.image} alt={post.description} className='posts_img' onClick={() => navigate(`/posts/${post.id}`)} />
              <div className='added_info_div'>
                <div className='description'>{post.description}</div>
                <div className='manage_post_container'>
                </div>
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
      )}
      </section>
    </div>
  );
}
export default ProfilePage;