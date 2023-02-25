import Link from 'next/link';
import React from 'react';
import Main_Layout from '../components/Main_Layout';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import { getError } from '../utils/handle_error';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
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
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@nu+.edu+.kz+$/i,
                message: 'Please enter a valid email',
              },
            })}
            className="w-full"
            id="email"
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
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
          <div className="mb-4 ">
            Don&apos;t have an account? &nbsp;
            <Link
              className="link"
              href={`/user_register?redirect=${redirect || '/'}`}
            >
              Register
            </Link>
          </div>
        </div>
      </form>
    </Main_Layout>
  );
}
