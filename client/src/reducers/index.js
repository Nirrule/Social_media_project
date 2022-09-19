import { combineReducers } from "redux";
import userReducer from "./userReducer";
import usersReducer from "./usersReducer";
import postReducer from "./postReducer";
import errorsReducer from "./errorsReducer";
import AllPostsReducer from "./AllPostReducer";
import trendsReducer from "./trendsReducer";

export default combineReducers({
  userReducer,
  usersReducer,
  postReducer,
  errorsReducer,
  AllPostsReducer,
  trendsReducer,
});
