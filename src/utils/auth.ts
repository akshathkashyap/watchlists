function setAuthUser(id: string) {
    const authCookie: string = `authId=${id}`;
    document.cookie = authCookie;
};

function getAuthUserId(): string | null {
    const name = "authId=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }

    return null;
}

function deleteAuthUser() {
    document.cookie = "authId" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const authUtils = {
    setAuthUser,
    getAuthUserId,
    deleteAuthUser
};

export default authUtils;
