import Swal from "sweetalert2";

const mutateData = async function (data: any, endpoint: string, method: string,moduleType:string = 'auth') {
    try {
        const cookie = document.cookie;
        const authToken = cookie.split('; ').find(row => row.startsWith('authToken='));
        const token = authToken ? authToken.split('=')[1] : null;

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        
        if (token) {
            headers.append("Authorization", `Bearer ${token}`);
        }
        const module = moduleType === 'auth' ? '3006' : '3005';
        return await fetch(`http://localhost:${module}/v1/${endpoint}`, {
            method: method,
            headers: headers,
            body: data,
            redirect: "follow"
        }).then(response=>{
            console.log(response);
            if(response.status === 200 || response.status === 201 ) return response.json()
            else response.json().then(res=>
                Swal.fire({
                icon: "error",
                text: res.message || "An error occurred."
            }))       
        })
    } catch (error) {
        console.error('Error fetching data:', error);
        return error;
    }
}

export default mutateData;
