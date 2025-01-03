import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkAddLike, thunkUpdateLike, thunkDeleteLike } from "../../redux/likes";

function LikeModal({ postId, isLiked = false, likeId = null, existingNote = "", refreshLikes}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [note, setNote] = useState(existingNote);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isLiked && likeId) {
      fetch(`/api/likes/${likeId}`)
        .then((res) => res.json())
        .then((data) => {
          setNote(data.note); 
        })
    }
  }, [isLiked, likeId]); 

  const handleInputChange = (event) => {
    setNote(event.target.value); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = await dispatch(thunkAddLike(postId, note));
    if (errors) {
      setErrors(errors);
    } else {
      closeModal()
    }
  };

  const handleUpdate = async () => {
    const errors = await dispatch(thunkUpdateLike(likeId, note));
    if (errors) {
      setErrors(errors);
    } else {
      closeModal()
      refreshLikes()
    }
  };

  const handleUnlike = async () => {
    await dispatch(thunkDeleteLike(likeId));
    closeModal()
    refreshLikes()
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
            onChange={handleInputChange} 
            placeholder="Write a note..."
          />
        </label>
        {!isLiked && <button type="submit">Like</button>} 
        {isLiked && (
          <>
            <button type="button" onClick={handleUpdate}>Edit</button>
            <button type="button" onClick={handleUnlike}>Unlike</button>
          </>
        )}
      </form>
    </div>
  );
}

export default LikeModal;
