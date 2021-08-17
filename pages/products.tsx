import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { Button } from "../components/button";
import { ErrorMessage } from "../components/error-message";
import { ProductList } from "../components/product-list";
import { Product, ProductListItem } from "../components/product-list-item";
import { Search } from "../components/search";
import { SVG } from "../public/svg";

interface ProductEntry extends Product {
  id: string;
  slug: string;
}

export const ALL_PRODUCTS_QUERY = gql`
  query ALL_PRODUCTS_QUERY {
    allProducts {
      id
      name
      slug
      featuredAsset {
        image {
          publicUrlTransformed
        }
      }
      facetValues {
        value: name
        facet {
          Group: name
        }
      }
      variantsCount
      status
      rating
    }
  }
`;

const Products = () => {
  const { data, error, loading } = useQuery(ALL_PRODUCTS_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage error={error} />;
  const { documents } = SVG;
  const { allProducts } = data;
  const productList = allProducts.map((product: any) => {
    let productItem: ProductEntry = { id: "", slug: "" };
    productItem.id = product?.id;
    productItem.slug = product?.slug;
    productItem.image = product?.featuredAsset?.image?.publicUrlTransformed;
    productItem.qty = product?.variantsCount;
    productItem.rating = product?.rating;
    productItem.title = product?.name;
    productItem.status = product?.status;
    const facetValues = product?.facetValues;
    facetValues.map((facetValue: any) => {
      if (facetValue?.facet?.Group === "Brand")
        productItem.brand = facetValue?.value;
      if (facetValue?.facet?.Group === "Gender")
        productItem.gender = facetValue?.value;
    });
    return productItem;
  });
  return (
    <div className="space-y-3">
      <div id="mymodal"></div>
      <Button href="/add-products">+ Add Product</Button>
      <Button href="#">
        <span className="inline-block mr-2">{documents}</span>Import Product
      </Button>
      <Search />
      <ProductList>
        {productList.map((product: any) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}/${product.id}`}
          >
            <a>
              <ProductListItem product={product} />
            </a>
          </Link>
        ))}
      </ProductList>
    </div>
  );
};

export default Products;
