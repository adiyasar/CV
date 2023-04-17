import { getSession } from 'next-auth/react';
import db from '../../../utils/mongoDB';
import User from '../../../Data/Users_model';
import Product from '../../../Data/Product_model';

const mostFrequent = (arr = [], num = 1) => {
  const map = {};
  let keys = [];
  for (let i = 0; i < arr.length; i++) {
    if (map[arr[i]]) {
      map[arr[i]]++;
    } else {
      map[arr[i]] = 1;
    }
  }
  for (let i in map) {
    keys.push(i);
  }
  keys = keys
    .sort((a, b) => {
      if (map[a] === map[b]) {
        if (a > b) {
          return 1;
        } else {
          return -1;
        }
      } else {
        return map[b] - map[a];
      }
    })
    .slice(0, num);
  return keys;
};

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }

  const { user } = session;
  const { items } = req.body;

  if (!items) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

  var arr = [];
  var item_data;
  await db.connect();
  const toUpdateUser = await User.findOne({ email: user.email });
  console.log('To Update: ' + toUpdateUser);
  for (const item of items) {
    item_data = await Product.findOne({ image: item.image });
    arr.push(item_data.category);
    console.log('FOUND: 1 ' + arr);
  }
  console.log('UPDATE: 1 ' + arr);
  var top_tags = [];
  var current_tags = toUpdateUser.favourite_tags;
  if (arr.length > 3) {
    top_tags = mostFrequent(arr, 3);
  } else {
    top_tags = arr;
  }

  console.log('Top Tags: ');
  console.log(top_tags);
  console.log('Current Tags: ');
  console.log(toUpdateUser.favourite_tags);
  //

  //   if (top_tags.length < 2) {
  //     if (!current_tags.includes(top_tags[0])) {
  //       top_tags.push(holder2);
  //       top_tags.push(holder3);
  //     } else {
  //       top_tags = current_tags;
  //     }
  //   } else if (top_tags.length < 3) {
  //     if (!current_tags.includes(top_tags[0])) {
  //       current_tags[0] = top_tags[0];
  //     }
  //     if (!current_tags.includes(top_tags[1])) {
  //       current_tags[1] = top_tags[1];
  //     }
  //     top_tags = current_tags;
  //   } else if (top_tags.length < 4) {
  //     if (!current_tags.includes(top_tags[0])) {
  //       current_tags[0] = top_tags[0];
  //     }
  //     if (!current_tags.includes(top_tags[1])) {
  //       current_tags[1] = top_tags[1];
  //     }
  //     if (!current_tags.includes(top_tags[2])) {
  //       current_tags[2] = top_tags[2];
  //     }
  //     top_tags = current_tags;
  //   }

  var holder0 = current_tags[0];
  var holder1 = current_tags[1];

  if (top_tags.length == 1) {
    if (current_tags.includes(top_tags[0])) {
      top_tags = current_tags;
    } else {
      holder0 = current_tags[0];
      holder1 = current_tags[1];
      current_tags[0] = top_tags[0];
      current_tags[1] = holder0;
      current_tags[2] = holder1;
      top_tags = current_tags;
    }
  } else if (top_tags.length == 2) {
    if (current_tags.includes(top_tags[0])) {
      console.log('Tag 1 is already present');
    } else {
      holder0 = current_tags[0];
      holder1 = current_tags[1];
      current_tags[0] = top_tags[0];
      current_tags[1] = holder0;
      current_tags[2] = holder1;
    }
    if (current_tags.includes(top_tags[1])) {
      console.log('Tag 2 is already present');
    } else {
      holder0 = current_tags[0];
      holder1 = current_tags[1];
      current_tags[0] = top_tags[1];
      current_tags[1] = holder0;
      current_tags[2] = holder1;
    }
    top_tags = current_tags;
  } else if (top_tags.length == 3) {
    if (current_tags.includes(top_tags[0])) {
      console.log('Tag 1 is already present');
    } else {
      holder0 = current_tags[0];
      holder1 = current_tags[1];
      current_tags[0] = top_tags[0];
      current_tags[1] = holder0;
      current_tags[2] = holder1;
    }
    if (current_tags.includes(top_tags[1])) {
      console.log('Tag 2 is already present');
    } else {
      holder0 = current_tags[0];
      holder1 = current_tags[1];
      current_tags[0] = top_tags[1];
      current_tags[1] = holder0;
      current_tags[2] = holder1;
    }
    if (current_tags.includes(top_tags[2])) {
      console.log('Tag 3 is already present');
    } else {
      holder0 = current_tags[0];
      holder1 = current_tags[1];
      current_tags[0] = top_tags[1];
      current_tags[1] = holder0;
      current_tags[2] = holder1;
    }
    top_tags = current_tags;
  }

  toUpdateUser.favourite_tags = top_tags;
  //

  await toUpdateUser.save();
  await db.disconnect();
  res.send({
    message: 'User updated',
  });
}

export default handler;
