import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkCreatePost } from '../../redux/posts';
import './CreatePostModal.css';

function CreatePostModal() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) formData.append('image', image);

    setLoading(true);

    const response = await dispatch(thunkCreatePost(formData));

    setLoading(false);

    if (!response.errors) {
      closeModal();
    } else {
      throw new Error("Failed to create post.");
    }
  };

  return (
    <div id="create-post-modal">
      <h2 style={{fontFamily: 'Sour Gummy'}}>Create a New Post</h2>
      <form 
        onSubmit={handleSubmit} 
        className='form'
        encType="multipart/form-data"
      >
        <label style={{fontFamily: 'Sour Gummy'}}>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength="50"
            placeholder="Optional"
          />
        </label>
        <label style={{fontFamily: 'Sour Gummy'}}>
          Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </label>
        <label style={{fontFamily: 'Sour Gummy'}}>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <button type="submit" style={{fontFamily: 'Sour Gummy'}} disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
        <button type="button" onClick={closeModal} style={{fontFamily: 'Sour Gummy'}}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default CreatePostModal;
