import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Menu } from '@headlessui/react';
import { Shop } from '../utils/Shop';
import { ToastContainer } from 'react-toastify';
import { signOut, useSession } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Main_Layout({ title, children }) {
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Shop);
  const { cart } = state;
  const [countCartItems, setCountCartItems] = useState(0);
  const [query, setQuery] = useState('');

  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  useEffect(() => {
    setCountCartItems(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);
  const logoutClickHandler = () => {
    Cookies.remove('cart-items');
    dispatch({ type: 'CART_EMPTY' });
    signOut({ callbackUrl: '/user_login' });
  };
  return (
    <>
      <Head>
        <title>{title ? title + '-NU Marketplace' : 'NU-Marketplace'}</title>
        <meta name="description" content="The marketplace of our campus" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="bottom-center" limit={1} />
      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md">
            <Link href="/" className="text-lg font-bold">
              NU Marketplace
            </Link>
            <form
              onSubmit={submitHandler}
              className="mx-auto  hidden w-full justify-center md:flex"
            >
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                className="rounded-tr-none rounded-br-none p-1 text-sm   focus:ring-0"
                placeholder="Search products"
              />
              <button
                className="rounded rounded-tl-none rounded-bl-none bg-amber-300 p-1 text-sm dark:text-black"
                type="submit"
                id="button-addon2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
            </form>
            <div>
              <Link href="/shopping_cart" className="p-2">
                Shopping Cart
                {countCartItems > 0 && (
                  <span className="ml-2 bg-yellow-400 px-2 py-1 text-xs text-white font-normal  rounded-full">
                    {countCartItems}
                  </span>
                )}
              </Link>

              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as="div" className="inline-block relative">
                  <Menu.Button className="text-yellow-500">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className=" absolute w-56 origin-top-right right-0 bg-white shadow-lg">
                    <Menu.Item>
                      <Link className="dropdown-prof link" href="/user_profile">
                        Edit Profile
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link className="dropdown-prof link" href="/seller/menu">
                        My Products
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link
                        className="dropdown-prof link"
                        href="/previous-orders"
                      >
                        Order History
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link
                        className="dropdown-prof link"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </Link>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/user_login" className="p-2">
                  Login
                </Link>
              )}
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
