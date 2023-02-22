import '../styles/globals.css';
import { ShopProvider } from '../utils/Shop';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ShopProvider>
        <Component {...pageProps} />
      </ShopProvider>
    </SessionProvider>
  );
}

export default MyApp;
