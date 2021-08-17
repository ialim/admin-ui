import { gql, useMutation, useQuery } from "@apollo/client";
import Router from "next/router";
import { Button } from "./button";
import { ErrorMessage } from "./error-message";
import Modal from "react-modal";
import { useState } from "react";
import { AddProductVariant } from "./add-product-variant";
import { UpdateProductVariant } from "./update-product-variant";
import { DeleteButton } from "./delete-button";

type SingleProductInput = {
  id: string;
  slug: string;
};

Modal.setAppElement("#mymodal");

const DELETE_VARIANT_MUTTATION = gql`
  mutation DELETE_VARIANT_MUTTATION($id: ID!) {
    deleteProductVariant(id: $id) {
      id
      name
    }
  }
`;

export const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      name
      description
      featuredAsset {
        image {
          publicUrlTransformed
        }
      }
      variants {
        id
        name
        asset {
          image {
            publicUrlTransformed
          }
        }
        isAvailable
        lastSoldPrice
        itemcode
        stockOnHand
      }
    }
  }
`;

export const SingleProduct = ({ id, slug }: SingleProductInput) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [productVariantId, setProductVariantId] = useState("");
  const openModal = () => {
    setIsOpen(true);
  };

  const afterOpenModal = () => {
    // references are now sync'd and can be accessed.
  };

  const closeModal = () => {
    setIsOpen(false);
    // Router.reload();
  };
  const { loading, error, data } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage error={error} />;
  const { Product } = data;

  const onCreateClick = () => {
    setProductVariantId("");
    console.log("create: ", productVariantId);
    openModal();
  };

  const onEditClick = (variantId: string) => {
    setProductVariantId(variantId);
    console.log("edit: ", productVariantId);
    openModal();
  };

  return (
    <div className="mx-5 my-3">
      {modalIsOpen ? (
        productVariantId ? (
          <UpdateProductVariant
            afterOpenModal={afterOpenModal}
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            productVariantId={productVariantId}
            productId={id}
          />
        ) : (
          <AddProductVariant
            afterOpenModal={afterOpenModal}
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            productId={id}
          />
        )
      ) : (
        ""
      )}

      <div className="px-5 py-5 rounded-md bg-gray-50 shadow-lg space-y-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={Product?.featuredAsset?.image?.publicUrlTransformed}
          alt={Product?.name}
          className="flex-none w-62 h-62 rounded-lg object-cover bg-gray-100"
          width="288"
          height="288"
        />
        <p>
          <span className="text-lg font-semibold capitalize">
            {Product?.name}
          </span>
        </p>
        <p className="font-medium text-sm text-justify">
          {Product?.description}
        </p>
        <div className="divide-y-2 divide-gray-400 divide-solid">
          <header className="flex flex-row justify-between items-center mb-2">
            <span className="font-medium text-lg mt-5 uppercase font-sans">
              Variants
            </span>{" "}
            {/* <Button href="/add-product-variant">+ Add Variants</Button> */}
            <button
              className="flex flex-row px-5 py-3 rounded-lg shadow-lg text-white uppercase tracking-wide font-semibold bg-gray-400 text-sm items-center"
              onClick={onCreateClick}
            >
              + Add Variant
            </button>
          </header>
          <div className="pt-2 space-y-1">
            {Product?.variants.map((variant: any) => (
              <div
                key={variant?.id}
                className="flex flex-row text-xs py-3 justify-between items-center bg-gray-100 rounded-md"
              >
                <div className=" flex ml-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={variant?.asset?.image?.publicUrlTransformed}
                    alt={variant?.name}
                    className="flex-none w-20 h-20 rounded-lg object-cover bg-gray-200"
                    width="144"
                    height="144"
                  />
                  <div className="ml-2 mt-1">
                    <p>{variant?.name}</p>
                    <p>
                      <span className="italic text-gray-400">#itemcode:</span>
                      {variant?.itemcode}
                    </p>
                    <p>Last sold at: {variant?.lastSoldPrice}</p>
                    {variant?.isAvailable && (
                      <p className="text-green-400 font-medium">Available</p>
                    )}
                  </div>
                </div>
                <div className="block space-y-1">
                  <button
                    className="flex flex-row p-3 rounded-lg shadow-lg text-white uppercase tracking-wide font-semibold bg-gray-400 text-sm w-20 text-center"
                    onClick={() => onEditClick(variant.id)}
                  >
                    Edit
                  </button>
                  <DeleteButton
                    id={variant.id}
                    query={DELETE_VARIANT_MUTTATION}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
