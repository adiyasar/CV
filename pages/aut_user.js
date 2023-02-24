import { useRouter } from 'next/router';
import React from 'react';
import Main_Layout from '../components/Main_Layout';

export default function NotLogged() {
  const router = useRouter();
  const { message } = router.query;
  return (
    <Main_Layout>
      <h1 className="text-xl">You must be logged in to use this function</h1>
      {message && <div className="mb-4 text-red-500">{message}</div>}
    </Main_Layout>
  );
}
