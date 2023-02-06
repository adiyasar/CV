import Main_Layout from '../components/Main_Layout';
import ItemPage from '../components/ItemPage';
import data from '../utils/data';

export default function Home() {
  return (
    <Main_Layout title="Home Page">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data.items.map((item) => (
          <ItemPage item={item} key={item.slug}></ItemPage>
        ))}
      </div>
    </Main_Layout>
  );
}
