import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkCreatePost } from '../../redux/posts';
import './CreatePostModal.css';

function CreatePostModal() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await dispatch(
      thunkCreatePost({ title, image, description })
    );

    if (!response.errors) {
      closeModal();
    } else {
      throw new Error("Failed to create post.");
    }
  };

  return (
    <div id="create-post-modal">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength="50"
            placeholder="Optional"
          />
        </label>
        <label>
          Image URL:
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <button type="submit">
          Post
        </button>
        <button type="button" onClick={closeModal}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default CreatePostModal;
