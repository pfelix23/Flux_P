import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import './LandingPage.css';
function LandingPage() {
    const [posts, setPosts] = useState([]);
    const [sessionPosts, setSessionPosts] = useState([])
    const [errors, setErrors] = useState();
    const [view, setView] = useState('all')
    const navigate = useNavigate();
    const sessionUser = useSelector((state) => state.session.user)

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
    }, [sessionUser]);        
    
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
                    return (
                        <picture onClick={() => navigate(`/api/posts/${post.id}`)} key={post.id}>
                            <img src={post.image} alt={post.description} className='posts_img' />
                            <div className='added_info'>
                            <div style={{fontFamily: 'Sour Gummy', color: 'white', paddingLeft: '20px'}}>{post.description}</div>
                            <div>{post.likes}</div>
                            <div>{post.comment_count}</div>
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