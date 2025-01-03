import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UserPage.css';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import CommentsModal from '../CommentsModal/CommentsModal';
import FollowModal from '../FollowModal/FollowModal';

function UserPage() {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followNote, setFollowNote] = useState("");
    const [errors, setErrors] = useState();
    const navigate = useNavigate();
    const { username } = useParams();

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

    }, [username]);

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

    return (
        <div className="posts_section">
            <h1>{username}</h1>

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

            <p>{followNote}</p>

            {posts.length === 0 ? (
                <p>This user has not made any posts.</p>
            ) : (
                <section className="posts_section">
                    {[...posts].reverse().map((post) => {
                        return (
                            <picture key={post.id}>
                                <img
                                    onClick={() => navigate(`/posts/${post.id}`)}
                                    src={post.image}
                                    alt={post.description}
                                    className="posts_img"
                                />
                                <div className="added_info">
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
            )}
        </div>
    );
}

export default UserPage;
