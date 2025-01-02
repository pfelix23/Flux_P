const LOAD_FOLLOWS = "follows/LOAD_FOLLOWS";
const ADD_FOLLOW = "follows/ADD_FOLLOW";
const UPDATE_FOLLOW = "follows/UPDATE_FOLLOW";
const DELETE_FOLLOW = "follows/DELETE_FOLLOW";

const loadFollows = (follows) => ({
  type: LOAD_FOLLOWS,
  payload: follows
});

const addFollow = (follow) => ({
  type: ADD_FOLLOW,
  payload: follow
});

const updateFollow = (follow) => ({
  type: UPDATE_FOLLOW,
  payload: follow
});

const deleteFollow = (followId) => ({
  type: DELETE_FOLLOW,
  payload: followId
});

export const thunkLoadFollows = () => async (dispatch) => {
  const response = await fetch("/api/follows/current");

  if (response.ok) {
    const data = await response.json();
    dispatch(loadFollows(data.follows));
  } else {
    console.error("Failed to load follows.");
  }
};

export const thunkAddFollow = (userId, note = "") => async (dispatch) => {
  const response = await fetch(`/api/follows/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note })
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addFollow(data));
    return null;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const thunkUpdateFollow = (userId, note) => async (dispatch) => {
  const response = await fetch(`/api/follows/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note })
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updateFollow(data));
    return null;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const thunkDeleteFollow = (userId) => async (dispatch) => {
  const response = await fetch(`/api/follows/${userId}`, {
    method: "DELETE"
  });

  if (response.ok) {
    dispatch(deleteFollow(userId));
  } else {
    console.error("Failed to unfollow.");
  }
};

const initialState = {};

const followsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_FOLLOWS: {
      const follows = {};
      action.payload.forEach((follow) => (follows[follow.following_id] = follow));
      return follows;
    }
    case ADD_FOLLOW:
      return { ...state, [action.payload.following_id]: action.payload };
    case UPDATE_FOLLOW:
      return { ...state, [action.payload.following_id]: action.payload };
    case DELETE_FOLLOW: {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
    default:
      return state;
  }
};

export default followsReducer;
