import { createSlice } from "@reduxjs/toolkit";
import localStorageUtils from "@/utils/localStorage";
import authUtils from "@/utils/auth";

export interface IUser {
    id: string;
    email: string;
    img?: string;
    watchlists?: string[]
}

interface IUserState {
    registeredUsers: IUser[] | null;
    currentUserId: string | null;
}

const initialState: IUserState = {
    registeredUsers: null,
    currentUserId: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setRegisteredUsers: (state, action) => {
            state.registeredUsers = action.payload;
            localStorageUtils.createRegisteredUsers(action.payload);
        },
        setCurrentUserId: (state, action) => {
            state.currentUserId = action.payload;
            authUtils.setAuthUser(action.payload);
        },
        updateUser: (state) => {
            state.registeredUsers = localStorageUtils.getRegisteredUsers();
            state.currentUserId = authUtils.getAuthUserId();
        }
    }
});


export const { setRegisteredUsers, setCurrentUserId, updateUser } = userSlice.actions;
export default userSlice.reducer;
