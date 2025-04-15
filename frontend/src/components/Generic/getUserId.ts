import {jwtDecode} from 'jwt-decode';

export function getCookie(name:any) {
    const value = `; ${document.cookie}`;
    const parts:any = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

export function getUserIdFromToken() {
    const token = getCookie('authToken');

    if (!token) {
        throw new Error('Authentication token not found in cookies.');
    }

    const decodedToken : any = jwtDecode(token);

    if (!decodedToken) {
        throw new Error('Failed to decode token.');
    }

    // Extract the user ID (assuming it's stored in the 'userId' field)
    
    const id = decodedToken.uid;
    const name = decodedToken.sub;

    if (!id) {
        throw new Error('User ID not found in token.');
    }

    return {id,name};
}