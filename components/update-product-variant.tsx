import { gql, useMutation, useQuery } from "@apollo/client";
import { AddProductVariantProps } from "./add-product-variant";
import { SINGLE_PRODUCT_QUERY } from "./single-product";
import { VariantFormInput, VariantModal } from "./variant-modal";

interface UpdateProductVariantProps extends AddProductVariantProps {
  productVariantId: string;
}

type UpdateProductVariantInput = {
  productVariantId?: string;
  name: string;
  asset?: any;
  facetValues?: any[];
};

const UPDATE_PRODUCT_VARIANT_MUTATION = gql`
  mutation UPDATE_PRODUCT_VARIANT_MUTATION(
    $productVariantId: ID!
    $name: String
    $asset: AssetWhereUniqueInput
    $facetValues: [FacetValueWhereUniqueInput]
  ) {
    updateProductVariant(
      id: $productVariantId
      data: {
        name: $name
        asset: { connect: $asset }
        facetValues: { connect: $facetValues }
      }
    ) {
      id
      name
    }
  }
`;

const PRODUCT_VARIANT_QUERY = gql`
  query PRODUCT_VARIANT_QUERY($id: ID) {
    ProductVariant(where: { id: $id }) {
      name
      Size: facetValues(where: { facet: { name: "Size" } }) {
        size: id
      }
      Fragrance: facetValues(where: { facet: { name: "Fragrance" } }) {
        fragrance: id
      }
      Type: facetValues(where: { facet: { name: "Type" } }) {
        type: id
      }
      Image: asset {
        image: id
      }
    }
  }
`;

export const UpdateProductVariant = ({
  closeModal,
  afterOpenModal,
  modalIsOpen,
  productId,
  productVariantId,
}: UpdateProductVariantProps) => {
  console.log("Update: ", productVariantId);
  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
  } = useQuery(PRODUCT_VARIANT_QUERY, {
    variables: { id: productVariantId },
  });

  const [
    updateProductVariant,
    { loading: mutationLoading, error: mutationError, data: mutationData },
  ] = useMutation(UPDATE_PRODUCT_VARIANT_MUTATION);

  const queriedUpdateData: VariantFormInput = {
    name: queryData?.ProductVariant?.name
      ? queryData?.ProductVariant?.name
      : "",
    type: queryData?.ProductVariant?.Type[0]?.type
      ? queryData?.ProductVariant?.Type[0]?.type
      : "",
    fragrance: queryData?.ProductVariant?.Fragrance[0]?.fragrance
      ? queryData?.ProductVariant?.Fragrance[0]?.fragrance
      : "",
    size: queryData?.ProductVariant?.Size[0]?.size
      ? queryData?.ProductVariant?.Size[0]?.size
      : "",
    image: queryData?.ProductVariant?.Image?.image
      ? queryData?.ProductVariant?.Image?.image
      : "",
  };

  const onSubmit = async (recievedData: VariantFormInput) => {
    const { name, size, fragrance, type, image } = recievedData;

    const updateProductVariantInput: UpdateProductVariantInput = {
      productVariantId,
      name,
      asset: { id: image },
      facetValues: [{ id: size }, { id: fragrance }, { id: type }],
    };

    console.log(updateProductVariantInput);
    try {
      const res = await updateProductVariant({
        variables: updateProductVariantInput,
        optimisticResponse: {
          updateProductVariant: {
            id: updateProductVariantInput.productVariantId,
            __typename: "ProductVariant",
            name: updateProductVariantInput.name,
          },
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <VariantModal
      closeModal={closeModal}
      afterOpenModal={afterOpenModal}
      modalIsOpen={modalIsOpen}
      heading="Update Product Variant"
      productId={productId}
      onSubmit={onSubmit}
      defaultValues={queriedUpdateData}
      operation="UPDATE"
      error={mutationError || queryError}
    />
  );
};
