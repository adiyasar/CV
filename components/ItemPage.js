/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';

export default function itemPage({ item, addToCart }) {
  return (
    <div className="card">
      <Link href={`/product/${item.slug}`}>
        <img
          src={item.image}
          alt={item.name}
          className="rounded shadow object-cover h-64 w-full"
        />
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${item.slug}`}>
          <h2 className="text-lg">{item.name}</h2>
        </Link>
        <p className="mb-2">{item.brand}</p>
        <p>${item.price}</p>
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCart(item)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
