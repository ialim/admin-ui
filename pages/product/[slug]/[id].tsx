import { SingleProduct } from "../../../components/single-product";

const ProductDetail = ({ query }: any) => {
  return (
    <>
      <div id="mymodal"></div>
      <SingleProduct id={query.id} slug={query.slug} />
    </>
  );
};
export default ProductDetail;
