import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Main_Layout({ title, children }) {
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
              <Link href="/cart" className="p-2">
                Shopping Cart
              </Link>
              <Link href="/login" className="p-2">
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
