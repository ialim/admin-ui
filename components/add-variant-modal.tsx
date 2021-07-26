import { gql, useMutation } from "@apollo/client";
import Router from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { fetchSelectOptions } from "../pages/add-products";
import { ErrorMessage } from "./error-message";
import { ModalProps, MyModal } from "./Modal";

interface AddVariantModalProps extends ModalProps {
  productId: string;
}

type VariantFormInput = {
  name: string;
  size: string;
  fragrance: string;
  type: string;
  image?: any;
};

type CreateProductVariantInput = {
  name: string;
//   asset?: any;
  facetValues?: any[];
  product: any;
};

const defaultValues: VariantFormInput = {
  name: "",
  type: "",
  fragrance: "",
  size: "",
  image: {},
};

const SELECT_FIELD_OPTIONS_QUERY = gql`
  query SELECT_FIELD_OPTIONS_QUERY {
    Type: Facet(where: { name: "Type" }) {
      types: values(orderBy: { name: asc }) {
        value: id
        label: name
      }
    }
    Fragrance: Facet(where: { name: "Fragrance" }) {
      fragrances: values(orderBy: { name: asc }) {
        value: id
        label: name
      }
    }
    Size: Facet(where: { name: "Size" }) {
      sizes: values(orderBy: { name: asc }) {
        value: id
        label: name
      }
    }
  }
`;

const CREATE_PRODUCT_VARIANT_MUTATION = gql`
  mutation CREATE_PRODUCT_VARIANT_MUTATION(
    $name: String
    $facetValues: [FacetValueWhereUniqueInput]
    $product: ProductWhereUniqueInput
  ) {
    createProduct(
      data: {
        name: $name
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

export const AddVariantModal = ({
  modalIsOpen,
  afterOpenModal,
  closeModal,
  productId,
}: AddVariantModalProps) => {
  const selectOptions = fetchSelectOptions(SELECT_FIELD_OPTIONS_QUERY);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
    watch,
    setValue,
  } = useForm<VariantFormInput>({
    defaultValues,
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(defaultValues);
    }
  }, [isSubmitSuccessful, reset]);

  const [createProductVariant, { loading, error, data }] = useMutation(
    CREATE_PRODUCT_VARIANT_MUTATION
  );

  const onSubmit = async (data: VariantFormInput) => {
    const { name, size, fragrance, type, image } = data;

    const createProductVariantInput: CreateProductVariantInput = {
      name,
      facetValues: [{ id: size }, { id: fragrance }, { id: type }],
      product: { id: productId },
    };
    console.log(createProductVariantInput)
    const res = await createProductVariant({
      variables: createProductVariantInput,
    });
    Router.push({
      pathname: `product/${res.data.createProductVariant?.product?.slug}/${res.data.createProductVariant?.product?.id}`,
    });
    console.log(res);
  };

  if (selectOptions.loading) return <p>Loading...</p>;
  if (selectOptions.error) return <ErrorMessage error={selectOptions.error} />;

  const {
    Type: { types },
    Fragrance: { fragrances },
    Size: { sizes },
  } = selectOptions.data;
  const typeOptions = [...types];
  const fragranceOptions = [...fragrances];
  const sizeOptions = [...sizes];
  return (
    <MyModal
      afterOpenModal={afterOpenModal}
      modalIsOpen={modalIsOpen}
      closeModal={closeModal}
    >
      <ErrorMessage error={error} />
      <form
        className="flex flex-col space-y-5 mx-5 pt-5 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="space-y-3" disabled={loading} aria-busy={loading}>
          <div className="flex flex-col space-y-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              className="form-input w-full rounded-md"
              {...register("name", { required: "This is required" })}
            />
            {errors?.name && <p>{errors.name.message}</p>}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="size">Size:</label>
            <select
              {...register("size", {
                required: "This is required",
              })}
              className="form-select rounded-md"
            >
              {sizeOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors?.type && <p>{errors.type.message}</p>}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="type">Type:</label>
            <select
              {...register("type", { required: "This is required" })}
              className="form-select rounded-md"
            >
              {typeOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors?.fragrance && <p>{errors.fragrance.message}</p>}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="fragrance">Fragrance:</label>
            <select
              {...register("fragrance", {
                required: "This is required",
              })}
              className="form-select rounded-md"
            >
              {fragranceOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors?.size && <p>{errors.size.message}</p>}
          </div>

          {/* <div className="flex flex-col space-y-1">
            <label htmlFor="slug">Image:</label>
            <input
              type="file"
              className="form-input flex flex-col w-full rounded-md"
              {...register("image")}
              multiple={false}
            />
          </div> */}
        </fieldset>

        <input
          type="submit"
          value="CREATE"
          className="form-input py-2 rounded-md bg-gray-100 hover:bg-gray-200 tracking-widest"
        />
      </form>
    </MyModal>
  );
};
