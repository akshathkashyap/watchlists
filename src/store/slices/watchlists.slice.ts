import localStorageUtils from "@/utils/localStorage";
import { createSlice } from "@reduxjs/toolkit";

interface IMovie {
    id: string;
    watched: boolean;
}

export interface IWatchlist {
    id: string;
    name: string;
    about: string;
    movies: IMovie[]
}

export interface IWatchlists {
    watchlists: IWatchlist[] | null;
}

const initialState: IWatchlists = {
    watchlists: null
}

const watchlistsSlice = createSlice({
    name: 'watchlists',
    initialState,
    reducers: {
        setWatchlists: (state, action) => {
            state.watchlists = action.payload;
            localStorageUtils.createWatchlistsByUserId(action.payload);
        },
        updateWatchlists: (state) => {
            state.watchlists = localStorageUtils.getWatchlistsByUserId();
        }
    }
});

export const { setWatchlists, updateWatchlists } = watchlistsSlice.actions;
export default watchlistsSlice.reducer;
