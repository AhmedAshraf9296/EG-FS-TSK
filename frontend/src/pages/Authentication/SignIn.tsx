import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '../../images/logo/eglogo.jpg';
import Logo from '../../images/logo/logo.svg';
import mutateData from '../../components/Generic/AJAX/MutateData';
import Swal from 'sweetalert2';

const SignIn: React.FC = () => {
  // State variables to manage form input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // State variables to manage form error states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    setEmailError(null);
    setPasswordError(null);

    let valid = true;
    if (!email) {
      setEmailError('Please enter your email');
      valid = false;
    }
    if (!password) {
      setPasswordError('Please enter your password');
      valid = false;
    }

    if (valid) {
      const userReq = { email, password };
      const user = await mutateData(JSON.stringify(userReq), 'login/email', 'POST','auth')
      if (user?.token) {
        const token = user.token;
        const expiresOn = new Date(user.expiresOn).toUTCString();
        document.cookie = `authToken=${token}; expires=${expiresOn}; path=/; Secure; SameSite=Strict`;
        sessionStorage.setItem('userName', user.user.name);
        sessionStorage.setItem('authToken', token);
        navigate('/')
      } else {
        Swal.fire({
          title: "Error",
          text: "User Data Not Correct",
          icon:'error'
        })
      }
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center">
        <div className="hidden w-full xl:block xl:w-1/2 text-center">
          <div className="py-17.5 px-26">
            {/* <Link to="/"> */}
            <img className="hidden dark:block" src={Logo} alt="Logo" />
            <img className="dark:hidden" src={LogoDark} alt="Logo" />
            {/* </Link> */}
          </div>
        </div>

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Sign In to Easy Generator
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && (
                    <span className="text-red-500 text-sm absolute top-14 left-0">
                      {emailError}
                    </span>
                  )}
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordError && (
                    <span className="text-red-500 text-sm absolute top-14 left-0">
                      {passwordError}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mb-5">
                <input
                  type="submit"
                  value="Sign In"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>

              {/* <div className="mb-5">
                <input
                  type="submit"
                  value="Sign Up"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div> */}


              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p>
                  Don’t have an account?{' '}
                  <Link to="/auth/signup" className="text-primary" style={{color:'orange'}}>
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
