import Cookies from 'js-cookie';
import { createContext, useReducer } from 'react';

export const Shop = createContext();

const initialState = {
  cart: Cookies.get('cart-items')
    ? JSON.parse(Cookies.get('cart-items'))
    : {
        cartItems: [],
        deliveryAddress: {},
      },
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      Cookies.set('cart-items', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'DELETE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );
      Cookies.set('cart-items', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_EMPTY':
      return {
        ...state,
        cart: {
          cartItems: [],
          deliveryAddress: { location: {} },
          paymentMethod: '',
        },
      };
    case 'CART_CLEAR_ITEMS':
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case 'SAVE_CHECKOUT':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    case 'SAVE_DELIVERY_DETAILS':
      return {
        ...state,
        cart: {
          ...state.cart,
          deliveryAddress: {
            ...state.cart.deliveryAddress,
            ...action.payload,
          },
        },
      };
    default:
      return state;
  }
}

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Shop.Provider value={value}>{children}</Shop.Provider>;
}
