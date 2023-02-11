import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Shop } from '../utils/Shop';

export default function Main_Layout({ title, children }) {
  const { state } = useContext(Shop);
  const { cart } = state;
  const [countCartItems, setCountCartItems] = useState(0);
  useEffect(() => {
    setCountCartItems(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, []);
  return (
    <>
      <Head>
        <title>{title ? title + '-NU Marketplace' : 'NU-Marketplace'}</title>
        <meta name="description" content="The marketplace of our campus" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md">
            <Link href="/" className="text-lg font-bold">
              NU Marketplace
            </Link>
            <div>
              <Link href="/shopping_cart" className="p-2">
                Shopping Cart
                {countCartItems > 0 && (
                  <span className="ml-2 bg-yellow-400 px-2 py-1 text-xs text-white font-normal  rounded-full">
                    {countCartItems}
                  </span>
                )}
              </Link>
              <Link href="/user_login" className="p-2">
                Login
              </Link>
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          NU Marketplace
        </footer>
      </div>
    </>
  );
}
