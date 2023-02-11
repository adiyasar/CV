import '../styles/globals.css';
import { ShopProvider } from '../utils/Shop';

function MyApp({ Component, pageProps }) {
  return (
    <ShopProvider>
      <Component {...pageProps} />
    </ShopProvider>
  );
}

export default MyApp;
