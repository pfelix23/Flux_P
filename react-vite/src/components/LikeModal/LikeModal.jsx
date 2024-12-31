import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkAddLike, thunkUpdateLike, thunkDeleteLike } from "../../redux/likes";

function LikeModal({ postId, isLiked = false, likeId = null, existingNote = "" }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [note, setNote] = useState(existingNote);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;

    if (isLiked && likeId) {
      response = await dispatch(thunkUpdateLike(likeId, note));
    } else {
      response = await dispatch(thunkAddLike(postId, note));
    }

    if (response) {
      setErrors(response);
    } else {
      closeModal();
    }
  };

  const handleUnlike = async () => {
    const response = await dispatch(thunkDeleteLike(likeId));
    if (!response) closeModal();
  };

  return (
    <div id="like-modal">
      <h2>{isLiked ? "Edit Like" : "Like Post"}</h2>
      {errors.error && <p className="error">{errors.error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Add a Note:
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a note..."
            disabled={isLiked && !isEditing}
          />
        </label>
        {!isLiked && <button type="submit">Like</button>}
        {isLiked && (
          <>
            {!isEditing && (
              <>
                <button type="button" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
                <button type="button" onClick={handleUnlike}>
                  Unlike
                </button>
              </>
            )}
            {isEditing && (
              <>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </>
            )}
          </>
        )}
      </form>
    </div>
  );
}

export default LikeModal;
