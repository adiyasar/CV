import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Marry Pop',
      email: 'marry_pop@nu.edu.kz',
      password: bcrypt.hashSync('dadadadadada'),
      rating: 4.5,
      numReviews: 11,
      isSeller: true,
    },
    {
      name: 'Joe Pop',
      email: 'joe_pop@nu.edu.kz',
      password: bcrypt.hashSync('dadadadadada'),
      rating: 4.1,
      numReviews: 9,
      isSeller: false,
    },
    {
      name: 'Ashley Moe',
      email: 'ashley_moe@nu.edu.kz',
      password: bcrypt.hashSync('dadadadadada'),
      rating: 4.8,
      numReviews: 39,
      isSeller: false,
    },
  ],
  items: [
    {
      name: 'Curry',
      slug: 'curry',
      category: 'Food',
      image:
        'https://res.cloudinary.com/dzgtws9bn/image/upload/v1679290542/ln5f7ugvd0vuffz9o9yl.jpg',
      price: 990,
      seller: 'Marry Pop',
      seller_email: 'marry_pop@nu.edu.kz',
      rating: 4.5,
      numReviews: 11,
      countInStock: 20,
      description: 'Home-made curry made with the best ingredients',
    },
    {
      name: 'Pasta',
      slug: 'pasta',
      category: 'Food',
      image:
        'https://res.cloudinary.com/dzgtws9bn/image/upload/v1679290760/mrjvt1sekrhouiv8hyl8.jpg',
      price: 750,
      seller: 'Marry Pop',
      seller_email: 'marry_pop@nu.edu.kz',
      rating: 4.5,
      numReviews: 11,
      countInStock: 11,
      description:
        'Classic italian pasta made with fresh tomatoes and olive oil. VEGAN',
    },
    {
      name: 'Iphone XR',
      slug: 'iphone-xr',
      category: 'Tech',
      image:
        'https://res.cloudinary.com/dzgtws9bn/image/upload/v1679291037/mw6ghfa8zpu06i6ndzha.jpg',
      price: 199000,
      seller: 'Joe Pop',
      seller_email: 'joe_pop@nu.edu.kz',
      rating: 4.1,
      numReviews: 9,
      countInStock: 1,
      description: 'Iphone-XR. In good condition, only used it for an year',
    },
    {
      name: 'ASUS ROG Strix',
      slug: 'asus-rog-strix',
      category: 'Tech',
      image:
        'https://res.cloudinary.com/dzgtws9bn/image/upload/v1679291051/kgedxxomt2mzcvtsym0y.jpg',
      price: 579000,
      seller: 'Joe Pop',
      seller_email: 'joe_pop@nu.edu.kz',
      rating: 4.1,
      numReviews: 9,
      countInStock: 1,
      description:
        'NEW and still in its box! G15 i7 10870H / 16ГБ / 1000SSD / RTX2060 6ГБ / 15.6 / DOS / (G512LV-HN246)',
    },
    {
      name: 'Black T-Shirt',
      slug: 'black-t-shirt',
      category: 'Clothes',
      image:
        'https://res.cloudinary.com/dzgtws9bn/image/upload/v1679291090/nxwgarc3pigshd7efbh0.jpg',
      price: 1990,
      seller: 'Ashley Moe',
      seller_email: 'ashley_moe@nu.edu.kz',
      rating: 4.8,
      numReviews: 39,
      countInStock: 27,
      description:
        'New, slim fit T-shits from Korea. Good quality, 100% breathable',
    },
    {
      name: 'Grey Running Shorts',
      slug: 'grey-running-shorts',
      category: 'Clothes',
      image:
        'https://res.cloudinary.com/dzgtws9bn/image/upload/v1679291099/o6ozbnxav2oimzwnunrx.jpg',
      price: 3990,
      seller: 'Ashley Moe',
      seller_email: 'ashley_moe@nu.edu.kz',
      rating: 4.8,
      numReviews: 39,
      countInStock: 27,
      description:
        'New, slim sport running shorts from Korea. Good quality, 100% breathable',
    },
    {
      name: 'Instant Ramen',
      slug: 'instant-ramen',
      category: 'Food',
      image:
        'https://res.cloudinary.com/dzgtws9bn/image/upload/v1679473551/ansekek8tnnogzytni3v.jpg',
      price: 690,
      seller: 'Ashley Moe',
      seller_email: 'ashley_moe@nu.edu.kz',
      rating: 4.8,
      numReviews: 39,
      countInStock: 120,
      description:
        'Everything that a college student could dream of (Stomach cancer included)',
      popular: true,
      banner:
        'https://res.cloudinary.com/dzgtws9bn/image/upload/v1679473551/ansekek8tnnogzytni3v.jpg',
    },
    {
      name: 'Macaron cookies (10 pieces)',
      slug: 'macaron-cookies',
      category: 'Food',
      image:
        'https://res.cloudinary.com/dzgtws9bn/image/upload/v1679473551/kzg5mqfnk6ynxhedqh8x.jpg',
      price: 1200,
      seller: 'Marry Pop',
      seller_email: 'marry_pop@nu.edu.kz',
      rating: 4.5,
      numReviews: 11,
      countInStock: 30,
      description: 'Sweet and crunchy. Freshly baked',
      popular: true,
      banner:
        'https://res.cloudinary.com/dzgtws9bn/image/upload/v1679473551/kzg5mqfnk6ynxhedqh8x.jpg',
    },
    {
      name: 'Custom Shirt',
      slug: 'custom-shirt',
      category: 'Clothes',
      image:
        'https://res.cloudinary.com/dzgtws9bn/image/upload/v1679473568/hxysy9gv4povtkzea7jn.png',
      price: 2990,
      seller: 'Ashley Moe',
      seller_email: 'ashley_moe@nu.edu.kz',
      rating: 4.8,
      numReviews: 39,
      countInStock: 12,
      description:
        'Custom shirt with a pretty cool design.  (In my opinion ^-^ ) ',
      popular: true,
      banner:
        'https://res.cloudinary.com/dzgtws9bn/image/upload/v1679473568/hxysy9gv4povtkzea7jn.png',
    },
    {
      name: 'Home Robes',
      slug: 'home-robes',
      category: 'Clothes',
      image:
        'https://res.cloudinary.com/dzgtws9bn/image/upload/v1679473550/wdwihsx1dof844bo1ytn.jpg',
      price: 4990,
      seller: 'Ashley Moe',
      seller_email: 'ashley_moe@nu.edu.kz',
      rating: 4.8,
      numReviews: 39,
      countInStock: 3,
      description: 'Cozy and warm robes to keep you...cozy and warm, duh',
      popular: true,
      banner:
        'https://res.cloudinary.com/dzgtws9bn/image/upload/v1679473550/wdwihsx1dof844bo1ytn.jpg',
    },
    {
      name: 'Winter Hoodie',
      slug: 'winter-hoodie',
      category: 'Clothes',
      image:
        'https://res.cloudinary.com/dzgtws9bn/image/upload/v1679473577/zdjcoaxo5rvrn9fvgf2w.jpg',
      price: 6990,
      seller: 'Ashley Moe',
      seller_email: 'ashley_moe@nu.edu.kz',
      rating: 4.8,
      numReviews: 39,
      countInStock: 1,
      description:
        'A perfect hoodie for a cold winter (A regular one in Astana, I guess.)',
      popular: true,
      banner:
        'https://res.cloudinary.com/dzgtws9bn/image/upload/v1679473577/zdjcoaxo5rvrn9fvgf2w.jpg',
    },
  ],
};

export default data;
