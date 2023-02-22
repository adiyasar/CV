import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'seller',
      email: 'seller@nu.edu.kz',
      password: bcrypt.hashSync('dadadadadada'),
      isSeller: true,
    },
    {
      name: 'user',
      email: 'user@nu.edu.kz',
      password: bcrypt.hashSync('dadadadadada'),
      isSeller: false,
    },
  ],
  items: [
    {
      name: 'Curry',
      slug: 'curry',
      category: 'Food',
      image: '/img/Curry.png',
      price: 990,
      seller: 'Mike',
      rating: 4.5,
      numReviews: 8,
      countInStock: 20,
      description: 'Home-made curry made with the best ingredients',
    },
    {
      name: 'Pasta',
      slug: 'pasta',
      category: 'Food',
      image: '/img/Pasta.jpg',
      price: 750,
      seller: 'Mike',
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
      image: '/img/IphoneXR.jpg',
      price: 199000,
      seller: 'Jamey',
      rating: 4.1,
      numReviews: 3,
      countInStock: 1,
      description: 'Iphone-XR. In good condition, only used it for an year',
    },
    {
      name: 'ASUS ROG Strix',
      slug: 'asus-rog-strix',
      category: 'Tech',
      image: '/img/AsusRog.jpg',
      price: 579000,
      seller: 'Jamey',
      rating: 4.1,
      numReviews: 3,
      countInStock: 1,
      description:
        'NEW and still in its box! G15 i7 10870H / 16ГБ / 1000SSD / RTX2060 6ГБ / 15.6 / DOS / (G512LV-HN246)',
    },
    {
      name: 'Black T-Shirt',
      slug: 'black-t-shirt',
      category: 'Clothes',
      image: '/img/Black_T_shirt.jpg',
      price: 1990,
      seller: 'Ashley',
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
      image: '/img/Grey_Running_Shorts.jpg',
      price: 3990,
      seller: 'Ashley',
      rating: 4.8,
      numReviews: 39,
      countInStock: 27,
      description:
        'New, slim sport running shorts from Korea. Good quality, 100% breathable',
    },
  ],
};

export default data;
