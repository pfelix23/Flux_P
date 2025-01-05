const CREATE_POST = "posts/CREATE_POST";
const UPDATE_POST = "posts/UPDATE_POST";
const DELETE_POST = "posts/DELETE_POST";

const createPost = (post) => ({
  type: CREATE_POST,
  payload: post,
});

const updatePost = (post) => ({
  type: UPDATE_POST,
  payload: post,
});

const deletePost = (postId) => ({
  type: DELETE_POST,
  payload: postId,
});

export const thunkCreatePost = (formData) => async (dispatch) => {
  const response = await fetch('/api/posts/create', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    const newPost = await response.json();
    dispatch(createPost(newPost));
    return newPost;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const thunkUpdatePost = (postId, title, description) => async (dispatch) => {
  const response = await fetch(`/api/posts/${postId}/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description })
  });

  if (response.ok) {
    const updatedPost = await response.json();
    dispatch(updatePost(updatedPost)); 
    return null;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const thunkDeletePost = (postId) => async (dispatch) => {
  const response = await fetch(`/api/posts/${postId}`, {
    method: "DELETE"
  });

  if (response.ok) {
    dispatch(deletePost(postId));
  } else {
    const errors = await response.json();
    return errors;
  }
};

const initialState = { posts: [] };

const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_POST: {
      return { ...state, posts: [action.payload, ...state.posts] };
    }

    case UPDATE_POST: {
      const updatedPosts = state.posts.map((post) =>
        post.id === action.payload.id ? { ...post, ...action.payload } : post
      );
      return { ...state, posts: updatedPosts };
    }

    case DELETE_POST: {
      const filteredPosts = state.posts.filter((post) => post.id !== action.payload);
      return { ...state, posts: filteredPosts };
    }

    default:
      return state;
  }
};

export default postsReducer;