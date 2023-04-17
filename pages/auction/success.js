import Link from 'next/link';
import Main_Layout from '../../components/Main_Layout';

export default function SuccessPage() {
  return (
    <Main_Layout title="Success">
      <div className="success-wrapper">
        <div className="success">
          <p className="icon">
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              width={100}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
              ></path>
            </svg>
          </p>
          <h2>Congratulations! </h2>

          <p className="email-msg">
            You have won the auction! You can now find it in your orders.
            Please, be notified that the order will be given out only{' '}
            <span className="text-red-600">after </span>
            you have paid for it.
          </p>

          <p className="description">
            If you have any questions, please email:
            <a className="email" href="mailto:nu_marketplace@gmail.com">
              nu_marketplace@gmail.com
            </a>
            <br />
            or the owner of the auction.
          </p>
          <Link href="/">
            <button type="button" width="300px" className="btn bg-amber-300">
              new order
            </button>
          </Link>
        </div>
      </div>
    </Main_Layout>
  );
}

SuccessPage.auth = true;
