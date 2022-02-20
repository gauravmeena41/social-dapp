import { combineReducers } from "redux";
import accountReducer from "./accountReducer";

const reducers = combineReducers({
  user: accountReducer,
});

export default reducers;
