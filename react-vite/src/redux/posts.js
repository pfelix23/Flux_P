const CREATE_POST = "posts/CREATE_POST";

const createPost = (post) => ({
  type: CREATE_POST,
  payload: post
});

export const thunkCreatePost = (postData) => async (dispatch) => {
  const response = await fetch('/api/posts/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
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

const initialState = { posts: [] };

const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_POST:
      return { ...state, posts: [action.payload, ...state.posts] };
    default:
      return state;
  }
}

export default postsReducer;