'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { MdOutlineMail } from "react-icons/md";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/slice/loadingSlice';
import { RootState } from '@/redux/store';
import { signIn } from '@/redux/slice/auth/auth';


interface FormState {
  email: string;
  password: string;
}

const Signin = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const [formData, setFormData] = useState<FormState>({
    email: "",
    password: "",
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = ['/img-1.jpg', '/img-2.jpg', '/img-3.jpg', '/img-4.jpg'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle form input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  // Handle sign-in submission
  const handleSignin = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic form validation
    if (!formData.email) {
      toast.error("Email is required.");
      return;
    }

    if (!formData.password) {
      toast.error("Password is required.");
      return;
    }

    dispatch(startLoading());

    try {
      const result = await dispatch(signIn(formData) as any).unwrap();

      if (result) {
        toast.success("Sign in successful!");
        router.push('/dashboard');
      }
    } catch (error: any) {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Sign-in failed! Please try again.");
      }
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <section className="w-full h-screen flex">
      {/* Image Section */}
      <div className="sm:w-0 lg:w-[60%] h-screen relative overflow-hidden">
        {images.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`Slide ${index}`}
            fill
            className={`object-cover absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            quality={100}
            priority={index === currentIndex}
          />
        ))}
      </div>

      {/* Form Section */}
      <div className="sm:w-full lg:w-[40%] h-screen flex items-center justify-center">
        <div className="w-full max-w-md flex flex-col items-center justify-center p-3">
          <div className="w-full">
            <h2 className="text-xl sm:text-2xl text-left font-semibold">
              Welcome, <br /> Sign in to continue.
            </h2>
          </div>
          <form
            className="w-full mt-5"
            onSubmit={handleSignin}
          >
            <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full outline-none border-none bg-transparent"
              />
              <MdOutlineMail size={25} className="text-gray-400 font-bold"/>
            </div>
            <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full outline-none border-none bg-transparent"
              />
              <div
                onClick={togglePasswordVisibility}
                className='cursor-pointer'
              >
                {passwordVisible ? (
                  <GoEye size={25} className="text-gray-400 font-bold"/>
                ) : (
                  <GoEyeClosed size={25} className="text-gray-400 font-bold"/>
                )}
              </div>
            </div>
            <button
              type='submit'
              className='w-full bg-primary-1 text-white font-bold capitalize text-center hover:border-2 rounded-lg hover:bg-transparent hover:text-primary-1 hover:border-primary-1 py-5 cursor-pointer'
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Sign In'}
            </button>
          </form>
          <p className='first-letter:capitalize text-gray-500 mt-5 text-center'>don't have an account? <span className='text-primary-1 capitalize font-bold cursor-pointer' onClick={() => router.push('/auth/sign-up')}>sign up</span></p>
        </div>
      </div>
    </section>
  );
};

export default Signin;
