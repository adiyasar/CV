import React from 'react';
import Main_Layout from '../../../components/Main_Layout';
import { toast } from 'react-toastify';
import { getError } from '../../../utils/handle_error';
import Link from 'next/link';
import Auction from '../../../Data/Auction_model';
import db from '../../../utils/mongoDB';
import User from '../../../Data/Users_model';
import axios from 'axios';

export default function ItemWindow(props) {
  const { auction, seller } = props;
  console.log('Data:');
  console.log(seller);

  const closeAuction = async () => {
    try {
      const { data } = await axios.put(`/api/auction/bid/close_bid`, {
        auction_item: auction,
      });
      console.log(data);
      toast.success('Auction Closed!');
    } catch (err) {
      toast.error(getError(err));
    }
    location.reload();
  };

  return (
    <Main_Layout title={auction.name}>
      <div className="py-2">
        <Link className="link text-lg" href="/seller/auctions">
          {String.fromCharCode(8592)} Back
        </Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <object
            className="custom_obj"
            data={auction.image}
            width={640}
            height={540}
          ></object>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{auction.name}</h1>
            </li>
            <li>Category: {auction.category}</li>
            <li>Description: {auction.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              {auction.current_bid > 0 ? (
                <div>Current Bid:</div>
              ) : (
                <div>Starting Bid:</div>
              )}
              {auction.current_bid > 0 ? (
                <div>₸ {auction.current_bid}</div>
              ) : (
                <div>₸ {auction.starting_price}</div>
              )}
            </div>
            <div className="mb-2 flex justify-between">
              <div>Current Bidder:</div>

              {auction.current_bid > 0 ? (
                <div> {auction.current_bidder}</div>
              ) : (
                <div>No bidders yet</div>
              )}
            </div>
          </div>

          <div>
            <div className="card p-5">
              <div>
                <p>
                  Would you like to close the auction{' '}
                  {auction.current_bid > 0
                    ? 'and accept the current bid?'
                    : '?'}
                </p>
                <br />
                <button className="def-button  w-full" onClick={closeAuction}>
                  Close Auction
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main_Layout>
  );
}

ItemWindow.auth = true;

export async function getServerSideProps(context) {
  const { params } = context;

  const { id } = params;
  console.log('Id:');
  console.log(id);

  await db.connect();
  const auction = await Auction.findById(id).lean();
  auction.timer = Math.floor(auction.timer / 1000);
  if (auction.current_bidder_id) {
    auction.current_bidder_id = auction.current_bidder_id.toString();
  }
  console.log(auction);

  const seller = await User.findOne({ email: auction.seller_email }).lean();

  await db.disconnect();
  return {
    props: {
      auction: auction ? db.convertDocToObj(auction) : null,
      seller: seller ? db.convertDocToObj(seller) : null,
    },
  };
}
