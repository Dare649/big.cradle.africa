'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/slice/loadingSlice';
import { RootState } from '@/redux/store';
import { signUp } from '@/redux/slice/auth/auth';
import BusinessDetails from '@/components/sign-up/business-details/page';
import IndustrialDetails from '@/components/sign-up/industrial-details/page';
import ContactDetails from '@/components/sign-up/contact-person-details/page';
import CredentialDetails from '@/components/sign-up/credentials/page';

interface FormState {
    business_name: string;
    contact_name: string;
    contact_number: string;
    business_address: string;
    business_city: string;
    business_state: string;
    business_country: string;
    user_img: string;
    sector: string;
    organization_size: string;
    email: string;
    role: string;
    password: string;
}

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormState>({
    business_name: '',
    business_address: '',
    business_city: '',
    business_state: '',
    business_country: '',
    user_img: '',
    email: '',
    sector: '',
    organization_size: '',
    contact_name: '',
    contact_number: '',
    role: 'business',
    password: '',
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = ['/img-1.jpg', '/img-3.jpg', '/img-4.jpg'];
  const totalSteps = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // Handle form input changes in one place
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const steps = [
    { title: 'Business Details', component: BusinessDetails },
    { title: 'Industry Details', component: IndustrialDetails },
    { title: 'Contact Person Details', component: ContactDetails },
    { title: 'Credential Details', component: CredentialDetails }
  ];

  const isStepValid = () => {
    switch (step) {
      case 0: // BusinessDetails
        if (!formData.business_name || !formData.business_address || !formData.business_city || !formData.business_state || !formData.business_country) {
          toast.warn("Please fill out all business details.");
          return false;
        }
        break;
      case 1: // IndustrialDetails
        if (!formData.sector || !formData.organization_size) {
          toast.warn("Please provide industrial information.");
          return false;
        }
        break;
      case 2: // ContactDetails
        if (!formData.contact_name || !formData.contact_number) {
          toast.warn("Please provide contact details.");
          return false;
        }
        break;
      case 3: // CredentialDetails
        if (!formData.email || !formData.password) {
          toast.warn("Email and password are required.");
          return false;
        }
        break;
    }
    return true;
  };
  

  const nextStep = () => {
    if (isStepValid()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  // Handle sign-in submission
  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    dispatch(startLoading());

    try {
      const result = await dispatch(signUp(formData) as any).unwrap();

      if (result) {
        toast.success("Sign in successful!");
        localStorage.setItem("userEmail", formData.email); // Store email in localStorage
        router.push("/auth/verify-otp"); 
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
      
      {/* Form Section */}
      <div className="sm:w-full lg:w-[40%] h-screen p-4 overflow-y-auto flex-col align-middle">
        <h2 className="text-xl sm:text-2xl text-prima text-left font-semibold">Welcome, <br /> Sign up to get started.</h2>
        <div className='w-full flex items-center justify-center px-4'>
          <div className="w-full">
            {/* Progress Bar */}
            <div className="w-full my-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Step {step + 1} of {totalSteps}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(((step + 1) / totalSteps) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-300">
                <div
                  className="bg-primary-1 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Form Steps */}
            <div className="w-full">
              {step === 0 && <BusinessDetails formData={formData} onChange={handleChange} />}
              {step === 1 && <IndustrialDetails formData={formData} onChange={handleChange} />}
              {step === 2 && <ContactDetails formData={formData} onChange={handleChange} />}
              {step === 3 && <CredentialDetails formData={formData} onChange={handleChange} />}
            </div>
 
            {/* Step Navigation */}
            <div className="flex justify-between mt-6">
              {step > 0 && (
                <button
                onClick={prevStep}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
                >
                  Back
                </button>
              )}
              {step < totalSteps - 1 ? (
                <button
                onClick={nextStep}
                
                  className="bg-primary-1 text-white px-4 py-2 rounded hover:bg-primary-2 cursor-pointer"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSignup}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
                >
                  Submit
                </button>
              )}
            </div>

            <p className='first-letter:capitalize text-tertiary-1 text-center mt-2'>already have an account? <span className='text-primary-1 capitalize font-bold cursor-pointer' onClick={() => router.push('/')}>sign in</span></p>
          </div>
        </div>
      </div>

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
    </section>
  );
};

export default Signup;
