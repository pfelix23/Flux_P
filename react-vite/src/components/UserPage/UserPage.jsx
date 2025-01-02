import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UserPage.css';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import CommentsModal from '../CommentsModal/CommentsModal';

function UserPage() {
    const [posts, setPosts] = useState([]);
    const [errors, setErrors] = useState();
    const navigate = useNavigate();
    const { username } = useParams(); 

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
    }, [username]);

    return (
        <div className='posts_section'>
            <section className='posts_section'>
                {[...posts].reverse().map((post) => {
                    return (
                        <picture key={post.id}>
                            <img
                                onClick={() => navigate(`/posts/${post.id}`)}
                                src={post.image}
                                alt={post.description}
                                className='posts_img'
                            />
                            <div className='added_info'>
                                <div>{post.username}</div>
                                <div>{post.description}</div>
                                <div>{post.likes}</div>
                                <div>{post.comment_count}</div>
                                <OpenModalMenuItem
                                    itemText="💬"
                                    modalComponent={<CommentsModal postId={post.id} />}
                                />
                            </div>
                        </picture>
                    );
                })}
            </section>
        </div>
    );
}

export default UserPage;
