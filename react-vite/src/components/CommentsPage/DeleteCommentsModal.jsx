import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";

function DeleteCommentsModal({ commentId, refreshComments }) {
    const [comment, setComment] = useState({});
    const { closeModal } = useModal();

    useEffect(() => {
        fetch(`/api/comments/${commentId}`)
            .then((res) => res.json())
            .then((data) => {
                setComment(data);
            })
            .catch((error) => {
                console.error("Error fetching comment:", error);
            });
    }, [commentId]);

    const handleDelete = () => {
        fetch(`/api/comments/${commentId}`, {
            method: "DELETE",
        })
        .then(() => {
            refreshComments()
        })
        .then(closeModal())
    };

    return (
        <div>
            <h3>Delete comment?</h3>
            <p>{comment.comment}</p>
            <button onClick={handleDelete}>Yes, Delete</button>
            <button onClick={closeModal}>Cancel</button>
        </div>
    );
}

export default DeleteCommentsModal;