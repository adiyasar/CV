import Link from 'next/link';
import React from 'react';
import Main_Layout from '../components/Main_Layout';
import { useForm } from 'react-hook-form';

export default function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = ({ email, password }) => {
    console.log(email, password);
  };
  return (
    <Main_Layout title="user_login">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Login</h1>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'The field is empty.',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@nu.edu.kz+$/i,
                message: 'Wrong email format',
              },
            })}
            autoFocus
            className="w-full "
            id="email"
          ></input>
          {errors.email && (
            <div className="text-red-600">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'The field is empty.',
              minLength: {
                value: 8,
                message: 'password should be at least 8 characters',
              },
            })}
            autoFocus
            className="w-full"
            id="password"
          ></input>
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Login</button>
        </div>
        <div className="mb-4">
          <Link href="registration">Create Account</Link>
        </div>
      </form>
    </Main_Layout>
  );
}
