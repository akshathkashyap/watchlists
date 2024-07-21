import { IUser } from "@/store/slices/user.slice";
import { IWatchlist } from "@/store/slices/watchlists.slice";
import authUtils from "./auth";

function registerUser(id: string, email: string) {
    const registeredUsersJSON: string | null = localStorage.getItem("registeredUsers");

    let registeredUsers: Record<string, string>;
    if (!registeredUsersJSON) {
        registeredUsers = {};
    } else {
        try {
            registeredUsers = JSON.parse(registeredUsersJSON);
        } catch (error) {
            console.error(error);
            localStorage.removeItem("registeredUsers");
            registeredUsers = {};
        }
    }

    registeredUsers[id] = email;

    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
}

function createRegisteredUsers(users: IUser[]) {
    localStorage.setItem("registeredUsers", JSON.stringify(users));
}

function getRegisteredUsers(): IUser[] | null {
    const registeredUsersJSON: string | null = localStorage.getItem("registeredUsers");
    if (!registeredUsersJSON) return null;

    try {
        return JSON.parse(registeredUsersJSON);
    } catch (error) {
        console.error(error);
        localStorage.removeItem("registeredUsers");
        return null;
    }
}

function createWatchlistsByUserId(watchlists: IWatchlist[]) {
    const watchlistsJSON: string | null = localStorage.getItem("watchlists");
    const userId: string | null = authUtils.getAuthUserId();
    if (!userId) return;

    let allWatchlists: Record<string, IWatchlist[]>;
    try {
        allWatchlists = JSON.parse(watchlistsJSON ?? "{}");
    } catch (error) {
        console.error(error);
        localStorage.removeItem("watchlists");
        return;
    }

    allWatchlists[userId] = watchlists;
    const allWatchlistsJSON = JSON.stringify(allWatchlists);
    localStorage.setItem("watchlists", allWatchlistsJSON);
}

function getWatchlistsByUserId(): IWatchlist[] {
    const watchlistsJSON: string | null = localStorage.getItem("watchlists");
    const userId: string | null = authUtils.getAuthUserId();
    if (!watchlistsJSON || !userId) return [];

    try {
        const allWatchlists: Record<string, IWatchlist[]> = JSON.parse(watchlistsJSON);
        return allWatchlists[userId];
    } catch (error) {
        console.error(error);
        localStorage.removeItem("watchlists");
        return [];
    }
}

function replaceUserIdForWatchlist(newUserId: string) {
    const watchlistsJSON: string | null = localStorage.getItem("watchlists");
    const userId: string | null = authUtils.getAuthUserId();

    if (!watchlistsJSON || !userId) return;

    try {
        const allWatchlists: Record<string, IWatchlist[]> = JSON.parse(watchlistsJSON);
        const watchlistsCopy = allWatchlists[userId];

        delete(allWatchlists[userId]);

        allWatchlists[newUserId] = watchlistsCopy;

        const allWatchlistsJSON = JSON.stringify(allWatchlists);
        localStorage.setItem("watchlists", allWatchlistsJSON);
    } catch (error) {
        console.error(error);
        localStorage.removeItem("watchlists");
        return;
    }
}

const localStorageUtils = {
    createRegisteredUsers,
    registerUser,
    getRegisteredUsers,
    createWatchlistsByUserId,
    getWatchlistsByUserId,
    replaceUserIdForWatchlist
};

export default localStorageUtils;
