import { useEffect, useState } from 'react';
import './FollowingPage.css';
// import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
// import FollowModal from '../FollowModal/FollowModal'


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


    return (
        <div>
            <h1>Follows</h1>
            <div className='follows'>
                {follows.reverse().map((follow) => {
                    return (
                        <div key={follow.id}>
                            <p><a href={`/${follow.following_username}`}>{follow.following_username}</a></p>
                            <p>{follow.note}</p>
                            {/* <OpenModalMenuItem
                                itemText="Manage"
                                modalComponent={<FollowModal followId={follow.id}/>}
                            /> */}
                        </div>
                    )
                })}
            </div>

        </div>
    )

}

export default FollowingPage