import { GET_ALL_POSTS } from "../actions/postAction";

const initialState = {};

export default function AllPostsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_POSTS:
      return action.payload;
    default:
      return state;
  }
}
