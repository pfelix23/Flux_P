import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkAddFollow, thunkUpdateFollow, thunkDeleteFollow } from "../../redux/follows";
import '../FollowingPage/FollowingPage.css'

function FollowModal({ userId, isFollowing = false, followId = null, existingNote = "", refreshFollows }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [note, setNote] = useState(existingNote);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isFollowing && followId) {
      fetch(`/api/follows/${followId}`)
        .then((res) => res.json())
        .then((data) => {
          setNote(data.note);
        });
    }
  }, [isFollowing, followId]);

  const handleInputChange = (event) => {
    setNote(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = await dispatch(thunkAddFollow(userId, note));
    if (errors) {
      setErrors(errors);
    } else {
      closeModal();
      refreshFollows();
    }
  };

  const handleUpdate = async () => {
    const errors = await dispatch(thunkUpdateFollow(userId, note));
    if (errors) {
      setErrors(errors);
    } else {
      closeModal();
      refreshFollows();
    }
  };

  const handleUnfollow = async () => {
    await dispatch(thunkDeleteFollow(userId));
    closeModal();
    refreshFollows();
  };

  return (
    <div id="follow-modal">
      <h2>{isFollowing ? "Edit Follow" : "Follow User"}</h2>
      {errors.error && <p className="error">{errors.error}</p>}
      <form onSubmit={handleSubmit}>
      <label style={{fontFamily: 'Sour Gummy'}}>
          Add a Note:
          <textarea
            value={note}
            onChange={handleInputChange}
            placeholder="Write a note..."
          />
        </label>
        {!isFollowing && <button type="submit">Follow</button>}
        {isFollowing && (
          <>
            <button type="button" onClick={handleUpdate}>Edit</button>
            <button type="button" onClick={handleUnfollow}>Unfollow</button>
          </>
        )}
      </form>
    </div>
  );
}

export default FollowModal;
