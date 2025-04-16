const fetchData = async (path: string, id?: number) => {
    //For Production Use
    // const urlPath = id ? `/api/${path}/${id}` : `/api/${path}`;
    const client = import.meta.env.VITE_API_URL_CLIENT   
    const urlPath = id ? `${client}/v1/${path}/${id}` : `${client}/v1/${path}`;
    const cookie = document.cookie;
    // const authToken = cookie.split('; ').find(row => row.startsWith('authToken='));
    // const token = authToken ? authToken.split('=')[1] : null;
    const authToken = sessionStorage.getItem('authToken');

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    
    if (authToken) {
        headers.append('Authorization', `Bearer ${authToken}`);
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
