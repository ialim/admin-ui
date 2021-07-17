import { Button } from "../components/button";
import { Search } from "../components/search";
import { SVG } from "../svg";

const Products = () => {
    const { documents } = SVG
  return (
    <div className="space-y-3">
      <Button href="#">+ Add Product</Button>
      <Button href="#"><span className="inline-block mr-2">{documents}</span>Import Product</Button>
      <Search />
    </div>
  );
};

export default Products;
