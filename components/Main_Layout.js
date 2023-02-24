import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Menu } from '@headlessui/react';
import { Shop } from '../utils/Shop';
import { ToastContainer } from 'react-toastify';
import { signOut, useSession } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import DropdownProfile from './DropdownProfile';
import Cookies from 'js-cookie';

export default function Main_Layout({ title, children }) {
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Shop);
  const { cart } = state;
  const [countCartItems, setCountCartItems] = useState(0);
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
                      <DropdownProfile
                        className="dropdown-prof"
                        href="/profile"
                      >
                        Profile
                      </DropdownProfile>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownProfile
                        className="dropdown-prof"
                        href="/order-history"
                      >
                        Order History
                      </DropdownProfile>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        className="dropdown-prof"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
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
