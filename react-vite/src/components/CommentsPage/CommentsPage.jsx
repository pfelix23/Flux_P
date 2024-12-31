import { useEffect, useState } from 'react';
import './CommentsPage.css';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import EditCommentsModal from './EditCommentsModal';
import DeleteCommentsModal from './DeleteCommentsModal';


function CommentsPage() {
    const [comments, setComments] = useState([]);
    const [errors, setErrors] = useState();

    useEffect(() => {
        fetch('/api/comments/current')
        .then((res) => res.json())
        .then((data) => setComments(data.comments))
        .catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
                console.log(errors)
            }
        })
    }, []);

    const refreshComments = () => {
        fetch('/api/comments/current')
            .then((res) => res.json())
            .then((data) => setComments(data.comments))
            .catch((error) => console.error("Error refreshing comments:", error));
    };


    return (
        <div>
            <h1>Comments</h1>
            <div className='follows'>
                {comments.reverse().map((comment) => {
                    return (
                        <div key={comment.id}>
                            <div>{comment.comment}</div>
                            <OpenModalMenuItem
                                itemText="Edit"
                                modalComponent={<EditCommentsModal commentId={comment.id}/>}
                            />
                            <OpenModalMenuItem
                                itemText="Delete"
                                modalComponent={<DeleteCommentsModal commentId={comment.id} refreshComments={refreshComments}/>}
                            />
                        </div>
                    )
                })}
            </div>

        </div>
    )

}

export default CommentsPage