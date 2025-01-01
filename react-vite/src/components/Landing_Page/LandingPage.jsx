import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './LandingPage.css';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import CommentsModal from '../CommentsModal/CommentsModal';


function LandingPage() {
    const [posts, setPosts] = useState([]);
    const [errors, setErrors] = useState();
    const navigate = useNavigate();

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
    }, []);

    return (
        <div className='posts_section'>
            <section className='posts_section'>
                {[...posts].reverse().map((post) => {
                    return (
                        <picture key={post.id}>
                            <img onClick={() => navigate(`/posts/${post.id}`)} src={post.image} alt={post.description} className='posts_img' />
                            <div className='added_info'>
                            <div>{post.description}</div>
                            <div>{post.likes}</div>
                            <div>{post.comment_count}</div>
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