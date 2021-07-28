import { gql, useMutation } from "@apollo/client";
import {
  VariantFormInput,
  VariantModal,
  VariantModalProps,
} from "./variant-modal";

export interface AddProductVariantProps
  extends Pick<
    VariantModalProps,
    "closeModal" | "afterOpenModal" | "modalIsOpen" | "productId"
  > {}

type CreateProductVariantInput = {
  name: string;
  asset?: any;
  facetValues?: any[];
  product?: any;
};

const defaultValues: VariantFormInput = {
  name: "",
  type: "",
  fragrance: "",
  size: "",
  image: "",
};

const CREATE_PRODUCT_VARIANT_MUTATION = gql`
  mutation CREATE_PRODUCT_VARIANT_MUTATION(
    $name: String
    $asset: AssetWhereUniqueInput
    $facetValues: [FacetValueWhereUniqueInput]
    $product: ProductWhereUniqueInput
  ) {
    createProductVariant(
      data: {
        name: $name
        asset: { connect: $asset }
        facetValues: { connect: $facetValues }
        product: { connect: $product }
      }
    ) {
      name
      product {
        id
        slug
      }
    }
  }
`;

export const AddProductVariant = ({
  closeModal,
  afterOpenModal,
  modalIsOpen,
  productId,
}: AddProductVariantProps) => {
  const [createProductVariant, { loading, error, data }] = useMutation(
    CREATE_PRODUCT_VARIANT_MUTATION
  );

  const onSubmit = async (recievedData: VariantFormInput) => {
    const { name, size, fragrance, type, image } = recievedData;

    const createProductVariantInput: CreateProductVariantInput = {
      name,
      asset: { id: image },
      facetValues: [{ id: size }, { id: fragrance }, { id: type }],
      product: { id: productId },
    };

    console.log(createProductVariantInput);
    try {
      const res = await createProductVariant({
        variables: createProductVariantInput,
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
      heading="Add Product Variant"
      productId={productId}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      operation="CREATE"
      error={error}
    >
      hello Add Product Variant
    </VariantModal>
  );
};
