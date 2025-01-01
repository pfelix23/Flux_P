import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './PostPage.css';

function PostPage() {
    const [post, setPost] = useState([]);
    const [errors, setErrors] = useState();
    const navigate = useNavigate();
    const post_id_object = useParams()
    const post_id = post_id_object.post_id
    const sessionUser = useSelector((state) => state.session.user)

    useEffect(() => {
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
    }, []);

    return (
        <div className='post_section'>
            <section className='post_section_2'>
                <picture onClick={() => navigate(`/posts/${post.id}`)} key={post.id} className='post_picture'>
                    <img src={post.image} alt={post.description} className='post_img' />
                    <div className='added_info_container'>
                    <div className='post_description'>{post.description}</div>
                    <div className='post_added_info'>{post.likes}</div>
                    <div className='post_added_info'>{post.comment_count}</div>
                    </div>
                </picture>                   
            </section>
        </div>
    )
}

export default PostPage