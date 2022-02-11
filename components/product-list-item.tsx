import Image from "next/image";
import { SVG } from "../public/svg";

export interface Product {
  image?: string;
  title?: string;
  qty?: number;
  gender?: string;
  status?: string;
  brand?: string;
  rating?: number;
}

interface ProductListItemProps {
  product: Product;
}

export const ProductListItem = ({ product }: ProductListItemProps) => {
  const { star } = SVG;
  return (
    <article className="p-4 flex space-x-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product?.image}
        alt={product?.title}
        className="flex-none w-18 h-18 rounded-lg object-cover bg-gray-100"
        width="144"
        height="144"
      />
      <div className="min-w-0 relative flex-auto sm:pr-20 lg:pr-0 xl:pr-20">
        <h2 className="text-md font-semibold text-black mb-0.5">
          {product?.title}
        </h2>
        <dl className="flex flex-col justify-between text-sm font-medium whitespace-pre">
          <div>
            <dt className="sr-only">Variant</dt>
            <dd>{product?.qty} variants</dd>
          </div>
          <div>
            <dt className="inline">For</dt>{" "}
            <dd className="inline text-black"> {product?.gender} </dd>
          </div>
          <div>
            <dt className="sr-only">Status</dt>
            <dd>{product?.status}</dd>
          </div>
          <div className="flex-none w-full mt-0.5 font-normal">
            <dt className="inline">By</dt>{" "}
            <dd className="inline text-black">{product?.brand}</dd>
          </div>
          <div className="absolute top-0 right-0 rounded-full bg-amber-50 text-amber-900 px-2 py-0.5 hidden sm:flex lg:hidden xl:flex items-center space-x-1">
            <dt className="text-amber-500">
              <span className="sr-only">Rating</span>
              {star}
            </dt>
            <dd>{product?.rating}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
};
