import Auction from '../../../../Data/Auction_model';
import db from '../../../../utils/mongoDB';

const deleteHandler = async (req, res) => {
  await db.connect();
  const auction = await Auction.findById(req.query.id);
  if (auction) {
    await auction.remove();
    await db.disconnect();
    res.send({ message: 'Auction deleted successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Auction not found' });
  }
};
export default deleteHandler;
