import { Navigate, Outlet } from 'react-router-dom';
const isAuthenticated = () => {
    // Retrieve the token from the cookie
    const cookie = document.cookie;
    // const authToken = cookie.split('; ').find(row => row.startsWith('authToken='));
    // handle it to work with AWS
    const authToken = sessionStorage.getItem('authToken');
    return authToken !== undefined; // Check if the authToken is present
  };
const PrivateRoute = () => {
    if (isAuthenticated()) {
        console.log(isAuthenticated());
        
        return <Outlet />; // Render the nested route
    } else {
        // Redirect to the login page if the user is not authenticated
        return <Navigate to="/auth/signin" />;
    }
};

export default PrivateRoute;