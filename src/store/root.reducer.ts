import { combineReducers } from "redux";
import userReducer from "./slices/user.slice";
import watchlistsReducer from "./slices/watchlists.slice";

const rootReducer = combineReducers({
    user: userReducer,
    watchlists: watchlistsReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
