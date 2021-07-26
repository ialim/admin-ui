import { SingleProduct } from "../../../components/SingleProduct";

const ProductDetail = ({ query }: any) => {
  return <SingleProduct id={query.id} />;
};
export default ProductDetail;
