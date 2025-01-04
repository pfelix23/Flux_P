import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkUpdatePost, thunkDeletePost } from '../../redux/posts';

function PostModal({ postId, existingTitle, existingDescription, refreshPosts }) {
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await dispatch(thunkUpdatePost(postId, title, description));
    if (errors) {
      alert('Error updating post');
    } else {
      closeModal();
      refreshPosts();
    }
  };

  const handleDelete = async () => {
    const errors = await dispatch(thunkDeletePost(postId));
    if (errors) {
      alert('Error deleting post');
    } else {
      closeModal(); 
      refreshPosts();
    }
  };

  return (
    <div id="create-post-modal">
      <h2 style={{ fontFamily: 'Sour Gummy' }}>Edit Post</h2>
      <form onSubmit={handleSubmit} className="form">
        <label style={{ fontFamily: 'Sour Gummy' }}>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength="50"
            placeholder="Optional"
          />
        </label>
        <label style={{ fontFamily: 'Sour Gummy' }}>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Write your post description here"
          />
        </label>
        <div>
          <button type="submit" style={{ fontFamily: 'Sour Gummy' }}>Update</button>
          <button type="button" onClick={handleDelete} style={{ fontFamily: 'Sour Gummy'}}>Delete</button>
        </div>
      </form>
    </div>
  );
}

export default PostModal;
