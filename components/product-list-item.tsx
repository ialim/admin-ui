import Image from "next/image";
import { SVG } from "../svg";

interface ProductListItemProps {
  product: {
    image: string;
    title: string;
    time: number;
    difficulty: string;
    servings: string;
    author: string;
    rating: number;
  };
}

export const ProductListItem = ({ product }: ProductListItemProps) => {
  const { star } = SVG;
  return (
    <article className="p-4 flex space-x-4">
      <Image
        src={product.image}
        alt=""
        className="flex-none w-18 h-18 rounded-lg object-cover bg-gray-100"
        width="144"
        height="144"
      />
      <div className="min-w-0 relative flex-auto sm:pr-20 lg:pr-0 xl:pr-20">
        <h2 className="text-lg font-semibold text-black mb-0.5">
          {product.title}
        </h2>
        <dl className="flex flex-wrap text-sm font-medium whitespace-pre">
          <div>
            <dt className="sr-only">Time</dt>
            <dd>
              <abbr title={`${product.time} minutes`}>{product.time}m</abbr>
            </dd>
          </div>
          <div>
            <dt className="sr-only">Difficulty</dt>
            <dd> · {product.difficulty}</dd>
          </div>
          <div>
            <dt className="sr-only">Servings</dt>
            <dd> · {product.servings} servings</dd>
          </div>
          <div className="flex-none w-full mt-0.5 font-normal">
            <dt className="inline">By</dt>{" "}
            <dd className="inline text-black">{product.author}</dd>
          </div>
          <div className="absolute top-0 right-0 rounded-full bg-amber-50 text-amber-900 px-2 py-0.5 hidden sm:flex lg:hidden xl:flex items-center space-x-1">
            <dt className="text-amber-500">
              <span className="sr-only">Rating</span>
              {star}
            </dt>
            <dd>{product.rating}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
};
