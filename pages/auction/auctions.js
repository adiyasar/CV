import React from 'react';

import Main_Layout from '../../components/Main_Layout';
import Link from 'next/link';
import db from '../../utils/mongoDB';
import Auction from '../../Data/Auction_model';
import AuctionPage from '../../components/AuctionPage';

export default function Home({ auction_data }) {
  console.log(auction_data);

  return (
    <Main_Layout className="layout" title="Home Page">
      <section className="header rounded shadow object-cover  w-full">
        <h1>NU Marketplace</h1>
        <p>Everything you might need in one click</p>

        <Link className="btn-bgstroke" href={`/`}>
          Main Page
        </Link>
      </section>

      <h2 className="h2 my-4">Latest Products</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {auction_data.map((auction) => (
          <AuctionPage auction={auction} key={auction.slug}></AuctionPage>
        ))}
      </div>
    </Main_Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const auctions_data = await Auction.find().lean();

  var auctions = auctions_data.filter(function (obj) {
    return obj.active;
  });
  auctions.map((x) => {
    x.timer = Math.floor(x.timer / 1000);
    if (x.current_bidder_id) {
      x.current_bidder_id = x.current_bidder_id.toString();
    }

    return x;
  });
  console.log(auctions);
  await db.disconnect();
  return {
    props: {
      auction_data: auctions.map(db.convertDocToObj),
    },
  };
}
