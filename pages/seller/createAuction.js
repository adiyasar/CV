import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Main_Layout from '../../components/Main_Layout';
import { getError } from '../../utils/handle_error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
}
export default function SellerItemEditPage() {
  const { query } = useRouter();
  const productId = query.id;
  const [{ loadingUpdate, loadingUpload }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const router = useRouter();

  const uploadHandler = async (e, imageField = 'image') => {
    const url = `https://api.cloudinary.com/v1_1/dzgtws9bn/upload`;
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const {
        data: { signature, timestamp },
      } = await axios('/api/seller/cloudinary');
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', 565166749963633);
      const { data } = await axios.post(url, formData);
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setValue(imageField, data.secure_url);
      toast.success('File uploaded successfully');
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  const submitHandler = async ({ name, price, image, description }) => {
    try {
      var Category = document.getElementById('Category');
      var category = Category.options[Category.selectedIndex].text;
      await axios.post(`/api/seller/createAuction`, {
        name,
        price,
        category,
        image,
        description,
      });
      toast.success('Product updated successfully');
      router.push('/seller/products');
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Main_Layout title={`Add Product ${productId}`}>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/seller/menu">Dashboard</Link>
            </li>
            <li>
              <Link href="/seller/orders">Orders</Link>
            </li>
            <li>
              <Link className="font-bold" href="/seller/products">
                Products
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <form
            className="mx-auto max-w-screen-md"
            onSubmit={handleSubmit(submitHandler)}
          >
            <h1 className="mb-4 text-xl">{`New Product `}</h1>
            <div className="mb-4">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="w-full"
                id="name"
                autoFocus
                {...register('name', {
                  required: 'Please enter name',
                })}
              />
              {errors.name && (
                <div className="text-red-500">{errors.name.message}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="price">Starting Price (₸)</label>
              <input
                type="text"
                className="w-full"
                id="price"
                {...register('price', {
                  required: 'Please enter price',
                })}
              />
              {errors.price && (
                <div className="text-red-500">{errors.price.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="image">Image-URL (Read only)</label>
              <input
                type="text"
                className="w-full"
                id="image"
                readOnly
                {...register('image', {
                  required: 'Please enter image',
                })}
              />
              {errors.image && (
                <div className="text-red-500">{errors.image.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="imageFile"> Image</label>
              <input
                type="file"
                className="w-full"
                id="imageFile"
                onChange={uploadHandler}
              />

              {loadingUpload && <div>Uploading....</div>}
            </div>
            <div className="mb-4">
              <label htmlFor="category">Category</label>
              <h1></h1>
              <select id="Category">
                <option value="Food">Food</option>
                <option value="Tech">Tech</option>
                <option value="Clothes">Clothes</option>
                <option value="Services">Services</option>
                <option value="Others">Others</option>
              </select>
              {errors.category && (
                <div className="text-red-500">{errors.category.message}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="countInStock">Description</label>
              <input
                type="text"
                className="w-full"
                id="description"
                {...register('description', {
                  required: 'Please enter description',
                })}
              />
              {errors.description && (
                <div className="text-red-500">{errors.description.message}</div>
              )}
            </div>
            <div className="mb-4">
              <button disabled={loadingUpdate} className="primary-button">
                {loadingUpdate ? 'Loading' : 'Start Auction'}
              </button>
            </div>
            <div className="mb-4">
              <Link href={`/seller/products`}>Back</Link>
            </div>
          </form>
        </div>
      </div>
    </Main_Layout>
  );
}
SellerItemEditPage.auth = true;
