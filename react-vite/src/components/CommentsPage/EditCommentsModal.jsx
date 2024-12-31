import { useEffect, useState } from "react";

function EditCommentsModal({ commentId }) {
    const [comment, setComment] = useState({});
    const [updatedComment, setUpdatedComment] = useState("");

    useEffect(() => {
        fetch(`/api/comments/${commentId}`)
            .then((res) => res.json()) 
            .then((data) => {
                setComment(data); 
                setUpdatedComment(data.comment);
            })
            .catch((error) => {
                console.error("Error fetching comment:", error);
            });
    }, [commentId]); 

    const handleInput = (event) => {setUpdatedComment(event.target.value)}

    const handleUpdate = () => {
        fetch(`/api/comments/${commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ comment: updatedComment }),
        })
            .then((res) => res.json())
            .then((data) => {
                setComment(data);
            })
    };

    return (
        <div key={comment.id}>
            <h3>Comment</h3>
            <form onSubmit={handleUpdate}>
                <textarea
                    value={updatedComment}
                    onChange={handleInput}
                />
                <div>
                    <button type="submit">Save</button>
                </div>
            </form>
        </div>
    );
}

export default EditCommentsModal;