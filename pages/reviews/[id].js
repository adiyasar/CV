import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Main_Layout from '../../components/Main_Layout';
import { getError } from '../../utils/handle_error';

export default function ReviewPage() {
  const { query } = useRouter();
  const productId = query.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const query_data = query.id;
  const data_set = query_data.split('abcdefghjkl');
  const orderId = data_set[0];
  const sellerEmail = data_set[1];
  const submitHandler = async ({ comment }) => {
    try {
      var Rating = document.getElementById('rating');
      var rating = Rating.options[Rating.selectedIndex].text;
      await axios.post(`/api/review`, {
        orderId,
        rating,
        comment,
        sellerEmail,
      });
      toast.success('Product updated successfully');
      router.push('/previous-orders');
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Main_Layout title={`Add Product ${productId}`}>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div className="md:col-span-3">
          <form
            className="mx-auto max-w-screen-md"
            onSubmit={handleSubmit(submitHandler)}
          >
            <h1 className="mb-4 text-xl">{`Review your purchase`}</h1>

            <div className="mb-4">
              <label htmlFor="rating">How was your purchase?</label>
              <h1></h1>
              <select id="rating">
                <option value="5">Excellent</option>
                <option value="4">Very Good</option>
                <option value="3">Average</option>
                <option value="2">Poor</option>
                <option value="1">Terrible</option>
              </select>
              {errors.category && (
                <div className="text-red-500">{errors.category.message}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="description">Description</label>
              <textarea
                type="text"
                className="textarea"
                id="comment"
                {...register('comment', {
                  required: 'Please enter comment',
                })}
              />
              {errors.description && (
                <div className="text-red-500">{errors.description.message}</div>
              )}
            </div>
            <div className="mb-4">
              <button className="primary-button">{'Submit'}</button>
            </div>
            <div className="mb-4">
              <Link href={`/previous-orders`}>Back</Link>
            </div>
          </form>
        </div>
      </div>
    </Main_Layout>
  );
}
ReviewPage.auth = true;
