import React from 'react';

import Main_Layout from '../../../components/Main_Layout';
import axios from 'axios';

import Link from 'next/link';
import { Rate } from 'antd';
import db from '../../../utils/mongoDB';
import Auction from '../../../Data/Auction_model';
import User from '../../../Data/Users_model';
import { toast } from 'react-toastify';
import { getError } from '../../../utils/handle_error';

const compareDates = (d1, d2) => {
  let date1 = d1.getTime();
  let date2 = d2.getTime();

  if (date1 < date2) {
    console.log(`${d1} is less than ${d2}`);
    return -1;
  } else if (date1 > date2) {
    console.log(`${d1} is greater than ${d2}`);
    return 1;
  } else {
    console.log(`Both dates are equal`);
    return 0;
  }
};

export default function ItemWindow(props) {
  const { auction, seller, compare_dates } = props;
  console.log('Test dates :' + compare_dates);
  var test_dates = compare_dates;
  const closeAuction = async () => {
    try {
      const { data } = await axios.put(`/api/auction/bid/close_bid`, {
        auction_item: auction,
      });
      console.log(data);
      test_dates = 100;
      // toast.error('Auction is already Closed!');

      location.href = '/auction/auctions';
    } catch (err) {
      toast.error(getError(err));
    }
  };

  if (test_dates < 0) {
    closeAuction();
  }

  function roundToHalf(value) {
    var converted = parseFloat(value);
    var decimal = converted - parseInt(converted, 10);
    decimal = Math.round(decimal * 10);
    if (decimal == 5) {
      return parseInt(converted, 10) + 0.5;
    }
    if (decimal < 3 || decimal > 7) {
      return Math.round(converted);
    } else {
      return parseInt(converted, 10) + 0.5;
    }
  }
  if (!auction || !auction.active) {
    return (
      <Main_Layout title="Error">
        Oops! Auction does not exist or has already been finished
      </Main_Layout>
    );
  }

  const addBid = async () => {
    var bid = document.getElementById('bid');

    try {
      if (bid.value <= auction.current_bid) {
        toast.error(
          'Incorrect bid amount! Please make sure that the bid is bigger that the current one :('
        );
        return;
      }
      const { data } = await axios.put(`/api/auction/bid/update_bid`, {
        new_bid: bid.value,
        auction_item: auction,
      });
      console.log(data);
      toast.success('Bid added!');
    } catch (err) {
      toast.error(getError(err));
    }

    console.log(bid.value);
    location.reload();
  };

  const desc = ['Terrible', 'Poor', 'Average', 'Very Good', 'Excellent'];

  return (
    <Main_Layout title={auction.name}>
      <div className="py-2">
        <Link className="link text-lg" href="/auction/auctions">
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
            <li>Seller: {auction.seller}</li>
            <li>
              Seller Rating: <></>
              <Rate
                allowHalf
                tooltips={desc}
                disabled
                defaultValue={roundToHalf(seller.rating)}
              />
              ({seller.numReviews} reviews)
            </li>
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
              <div>
                {auction.current_bid > 0
                  ? auction.current_bidder
                  : 'No bidders yet'}
              </div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status:</div>
              <div>{auction.active ? 'Active' : 'Sold out'}</div>
            </div>

            <div>
              <input
                name="bid"
                type="text"
                maxLength="512"
                id="bid"
                className="w3-input"
              />

              <div>&nbsp;</div>
              <button className="primary-button w-full" onClick={addBid}>
                Add Bid
              </button>
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

  const { slug } = params;

  await db.connect();
  const auction = await Auction.findOne({ slug }).lean();
  const current_date = new Date();
  console.log('Timer');
  console.log(auction.timer);
  console.log('Date:');
  console.log(current_date);
  const test_dates = compareDates(auction.timer, current_date);
  console.log('Compate dates' + test_dates);

  auction.timer = Math.floor(auction.timer / 1000);
  if (auction.current_bidder_id) {
    auction.current_bidder_id = auction.current_bidder_id.toString();
  }
  const seller = await User.findOne({ email: auction.seller_email }).lean();

  await db.disconnect();
  return {
    props: {
      auction: auction ? db.convertDocToObj(auction) : null,
      seller: seller ? db.convertDocToObj(seller) : null,
      compare_dates: test_dates ? test_dates : null,
    },
  };
}
