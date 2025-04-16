import Swal from 'sweetalert2'

const handleDelete=(ID:number|string,name:string|null,endpoint:string,cb:()=>void,message:string = "")=>{
    Swal.fire({
        title: `Are You Sure You want to delete ${message.length > 0 ? message: endpoint}  ? `,
        text:``,
        icon:"error",
        confirmButtonText:"Yes",
        cancelButtonText:"Cancel",
        showCancelButton:true,
    }).then(async isConfirm=>{
        if(isConfirm.isConfirmed){
            const cookie = document.cookie;
            const authToken = cookie.split('; ').find(row => row.startsWith('authToken='));
            const token = authToken ? authToken.split('=')[1] : null;
    
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            
            if (token) {
                headers.append("Authorization", `Bearer ${token}`);
            }
            const client = import.meta.env.VITE_API_URL_CLIENT   
                const req = await fetch(`${client}/v1/${endpoint}/${ID}`, {
                    method: "DELETE",
                    headers: headers,
                });
                
                if(req.status == 200){
                    Swal.fire({
                        icon:"success",
                        text:`${endpoint} : ${ID} is Deleted Successfully`,
                    })
                    cb();
                }else{
                    const res :any =await req.json();
                    
                    Swal.fire({
                        icon:"error",
                        text:`${res.message}`
                    })
                }
                return req.json();
        }
    })
}
export default handleDelete;