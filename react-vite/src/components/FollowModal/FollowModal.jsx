import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkAddFollow, thunkUpdateFollow, thunkDeleteFollow } from "../../redux/follows";

function FollowModal({ userId, isFollowing = false, followId = null, existingNote = "" }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [note, setNote] = useState(existingNote);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;

    if (isFollowing && followId) {
      response = await dispatch(thunkUpdateFollow(userId, note));
    } else {
      response = await dispatch(thunkAddFollow(userId, note));
    }

    if (response) {
      setErrors(response);
    } else {
      closeModal();
    }
  };

  const handleUnfollow = async () => {
    const response = await dispatch(thunkDeleteFollow(userId));
    if (!response) closeModal();
  };

  return (
    <div id="follow-modal">
      <h2>{isFollowing ? "Edit Follow" : "Follow User"}</h2>
      {errors.error && <p className="error">{errors.error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Add a Note:
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a note..."
            disabled={isFollowing && !isEditing}
          />
        </label>
        {!isFollowing && <button type="submit">Follow</button>}
        {isFollowing && (
          <>
            {!isEditing && (
              <>
                <button type="button" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
                <button type="button" onClick={handleUnfollow}>
                  Unfollow
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

export default FollowModal;
