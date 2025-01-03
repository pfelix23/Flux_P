import { useEffect, useState } from 'react';
import './FollowingPage.css';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import FollowModal from '../FollowModal/FollowModal'

function FollowingPage() {
    const [follows, setFollows] = useState([]);
    const [errors, setErrors] = useState();

    useEffect(() => {
        fetch('/api/follows/current')
        .then((res) => res.json())
        .then((data) => setFollows(data.follows))
        .catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
                console.log(errors)
            }
        })
    }, []);

    const refreshFollows = () => {
        fetch('/api/follows/current')
            .then((res) => res.json())
            .then((data) => setFollows(data.follows))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                    console.log(errors);
                }
            });
    };


    return (
        <div>
            <h1>Follows</h1>
            <div className='follows'>
                {follows.length === 0 ? (
                    <p>You are not following any users.</p> 
                ) : (
                    follows.reverse().map((follow) => {
                        return (
                            <div key={follow.id}>
                                <p><a href={`/${follow.following_username}`}>{follow.following_username}</a></p>
                                <p>{follow.note}</p>
                                <OpenModalMenuItem
                                    itemText="Manage"
                                    modalComponent={<FollowModal 
                                        followId={follow.id}
                                        userId={follow.following_id}
                                        isFollowing={true}
                                        refreshFollows={refreshFollows}
                                        existingNote={follow.note}/>}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default FollowingPage