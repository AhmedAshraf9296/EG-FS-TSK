const fetchData = async (path: string, id?: number) => {
    //For Production Use
    // const urlPath = id ? `/api/${path}/${id}` : `/api/${path}`;

    const urlPath = id ? `http://localhost:3005/v1/${path}/${id}` : `http://localhost:3005/v1/${path}`;
    const cookie = document.cookie;
    const authToken = cookie.split('; ').find(row => row.startsWith('authToken='));
    const token = authToken ? authToken.split('=')[1] : null;

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    
    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }

    const req = await fetch(urlPath, {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
    });

    if (req.status === 200) {
        const data = await req.json();
        return data;
    } else {
        return [];
    }
};

export default fetchData;
