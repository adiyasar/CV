/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';

export default function AuctionPage({ auction }) {
  return (
    <div className="card">
      <Link href={`/auction/product/${auction.slug}`}>
        {/* <img
          src={item.image}
          alt={item.name}
          className="rounded shadow object-cover h-64 w-full"
        /> */}
        <object
          data={auction.image}
          className="rounded shadow object-cover h-64 w-full"
        ></object>
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/auction/product/${auction.slug}`}>
          <h2 className="text-lg">{auction.name}</h2>
        </Link>
        <p className="mb-2">{auction.brand}</p>
        <h2>Starting Price:</h2>
        <p>₸{auction.starting_price}</p>
      </div>
    </div>
  );
}
