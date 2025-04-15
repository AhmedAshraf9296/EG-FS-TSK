import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '../../images/logo/eglogo.jpg';
import Logo from '../../images/logo/eglogo.jpg';
import mutateData from '../../components/Generic/AJAX/MutateData';
import GenericInput from '../../components/Generic/Input';

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignUp: React.FC = () => {
    // State variables to manage form inputs
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State variables to manage form errors
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    // Get the navigate function
    const navigate = useNavigate();

    // Function to handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset form errors
        setFormErrors({});

        // Perform form validation
        const errors = validateForm({ name, email, phone, password, confirmPassword });
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // Perform form submission to your API endpoint
        const userData = {
            name,
            email,
            phone,
            password,
            confirmPassword
        };

        try {
            // Send the user data to the server (e.g., using fetch or axios)
            // Handle the response as needed
            userData.phone = '+2' + userData.phone;
            const response = await mutateData(JSON.stringify(userData),'signup','POST');
            if (response.user._id.length) {
                navigate('/auth/signin');
            } else {
                // Handle error response if needed
                const errorData = await response.json();
                console.error('Error during sign-up:', errorData);
            }
        } catch (error) {
            console.error('Error during sign-up:', error);
        }
    };

    // Function to validate form inputs
    const validateForm = ({
        name,
        email,
        phone,
        password,
        confirmPassword,
      }: {
        name: string;
        email: string;
        phone: string;
        password: string;
        confirmPassword: string;
      }) => {
        const errors: FormErrors = {};
      
        // Name validation: minimum 3 characters
        if (!name) {
          errors.name = 'Name is required';
        } else if (name.trim().length < 3) {
          errors.name = 'Name must be at least 3 characters';
        }
      
        // Email validation: valid format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
          errors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
          errors.email = 'Enter a valid email address';
        }
      
        // Phone validation (if needed)
        if (!phone) {
          errors.phone = 'Phone is required';
        }
      
        // Password validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!password) {
          errors.password = 'Password is required';
        } else if (!passwordRegex.test(password)) {
          errors.password =
            'Password must be at least 8 characters, include one letter, one number, and one special character';
        }
      
        // Confirm password validation
        if (!confirmPassword) {
          errors.confirmPassword = 'Confirm password is required';
        } else if (password !== confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
      
        return errors;
      };
      const getPasswordValidationStatus = (password: string) => {
        return {
          length: password.length >= 8,
          letter: /[A-Za-z]/.test(password),
          number: /\d/.test(password),
          special: /[@$!%*#?&]/.test(password),
        };
      };
      const passwordValidation = getPasswordValidationStatus(password);

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-wrap items-center">
                <div className="hidden w-full xl:block xl:w-1/2">
                    <div className="py-17.5 px-26 text-center">
                        <Link className="mb-5.5 inline-block" to="/">
                            <img className="hidden dark:block" src={Logo} alt="Logo" />
                            <img className="dark:hidden" src={LogoDark} alt="Logo" />
                        </Link>
                    </div>
                </div>

                <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
                    <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                            Sign Up to Easy Generator
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <GenericInput
                              id="name"
                              label='Name'
                              name='name'
                              placeholder="Enter Name"
                              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              value={name}
                              onChange={(e) => setName(e.target.value)
                              }
                              error={formErrors.name}
                            />
                            <GenericInput
                              id="email"
                              label='Email'
                              name='email'
                              placeholder="Enter Email"
                              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)
                              }
                              error={formErrors.email}
                            />
                            <GenericInput
                              id="phone"
                              label='Phone'
                              name='phone'
                              placeholder="Enter Phone"
                              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)
                              }
                              error={formErrors.phone}
                            />
                            <GenericInput
                              id="password"
                              label='Password'
                              name='Password'
                              placeholder="Enter Password"
                              type='password'
                              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)
                              }
                            />
                            {password.length > 0 ? <div className="mt-2 text-sm">
                            <p className={`flex items-center gap-2 ${passwordValidation.length ? 'text-green-600' : 'text-red-500'}`}>
                                {passwordValidation.length ? '✅' : '❌'} At least 8 characters
                            </p>
                            <p className={`flex items-center gap-2 ${passwordValidation.letter ? 'text-green-600' : 'text-red-500'}`}>
                                {passwordValidation.letter ? '✅' : '❌'} At least one letter
                            </p>
                            <p className={`flex items-center gap-2 ${passwordValidation.number ? 'text-green-600' : 'text-red-500'}`}>
                                {passwordValidation.number ? '✅' : '❌'} At least one number
                            </p>
                            <p className={`flex items-center gap-2 ${passwordValidation.special ? 'text-green-600' : 'text-red-500'}`}>
                                {passwordValidation.special ? '✅' : '❌'} At least one special character (@$!%*#?&)
                            </p>
                            </div> : null}
                            <GenericInput
                              id="confirmPassword"
                              label='Confirm Password'
                              name='confirmPassword'
                              placeholder="Confirm Password"
                              type='password'
                              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)
                              }
                              error={formErrors.confirmPassword}
                            />
                            {formErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
                            )}
                            {/* Submit Button */}
                            <div className="mb-5" style={{padding:'15px' , width:'100%'}}>
                                <input
                                    type="submit"
                                    value="Create account"
                                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                                />
                            </div>

                            {/* Already have an account link */}
                            <div className="mt-6 text-center">
                                <p>
                                    Already have an account?{' '}
                                    <Link to="/auth/signin" className="text-primary">
                                        Sign in
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

export default SignUp;
