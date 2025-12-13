"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");

  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [mobileNumberError, setMobileNumberError] = useState<string>("");

  const validateFirstName = (value: string) => {
    if (!value) setFirstNameError("First name is required.");
    else if (!/^[A-Za-z]+$/.test(value))
      setFirstNameError("First name should contain only letters.");
    else setFirstNameError("");
    setFirstName(value);
  };

  const validateLastName = (value: string) => {
    if (!value) setLastNameError("Last name is required.");
    else if (!/^[A-Za-z]+$/.test(value))
      setLastNameError("Last name should contain only letters.");
    else setLastNameError("");
    setLastName(value);
  };

  const validateEmail = (value: string) => {
    if (!value) setEmailError("Email is required.");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      setEmailError("Invalid email format.");
    else setEmailError("");
    setEmail(value);
  };

  const validatePassword = (value: string) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!value) setPasswordError("Password is required.");
    else if (!strongPasswordRegex.test(value))
      setPasswordError(
        "Must be 6+ chars, include upper/lowercase, number & special character."
      );
    else setPasswordError("");
    setPassword(value);
  };

  const validateMobileNumber = (value: string) => {
    if (!value) setMobileNumberError("Phone number is required.");
    else if (!/^\+?\d{10,}$/.test(value))
      setMobileNumberError("Invalid phone number (e.g., +1234567890)");
    else setMobileNumberError("");
    setMobileNumber(value);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      firstNameError ||
      lastNameError ||
      emailError ||
      passwordError ||
      mobileNumberError ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !mobileNumber
    ) {
      setEmailError("Please fill all required fields correctly.");
      return;
    }

    try {
      const signUpData = {
        firstname: firstName,
        lastname: lastName,
        mobileNumber,
        email,
        password,
      };

      const response = await fetch(
        "http://localhost:5000/api/crm/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signUpData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Store token in localStorage (optional, depending on your app's needs)
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      router.push("/login");
    } catch (err: any) {
      setEmailError(err.message || "Signup failed");
      console.error(err);
      if (err.message.includes("User already exists")) {
        router.push("/login");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <form onSubmit={handleSignUp} className="space-y-6">
          <h1 className="text-3xl font-bold text-center text-emerald-600">
            Create Account
          </h1>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => validateFirstName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            {firstNameError && (
              <p className="text-red-500 text-sm mt-1">{firstNameError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => validateLastName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            {lastNameError && (
              <p className="text-red-500 text-sm mt-1">{lastNameError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => validateMobileNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="+1234567890"
              required
            />
            {mobileNumberError && (
              <p className="text-red-500 text-sm mt-1">{mobileNumberError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => validatePassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Create Account
          </button>
          <div className="text-center mt-4">
            <Link
              href="/login"
              className="text-emerald-600 font-medium hover:text-emerald-700"
            >
              Already have an account? Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
