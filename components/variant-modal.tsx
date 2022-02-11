import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "./error-message";
import { ModalProps, MyModal } from "./Modal";

export interface VariantModalProps extends ModalProps {
  productId: string;
  onSubmit: (data: VariantFormInput) => Promise<void>;
  defaultValues: VariantFormInput;
  error: any;
  operation: string;
}

export type VariantFormInput = {
  name: string;
  size: string;
  fragrance: string;
  type: string;
  image?: string;
};

const SELECT_FIELD_OPTIONS_QUERY = gql`
  query SELECT_FIELD_OPTIONS_QUERY($id: ID) {
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
    Asset: allAssets(where: { product: { id: $id } }) {
      value: id
      label: altText
    }
  }
`;

export const VariantModal = ({
  modalIsOpen,
  afterOpenModal,
  closeModal,
  productId,
  heading,
  onSubmit,
  defaultValues,
  error,
  operation,
}: VariantModalProps) => {
  const {
    loading,
    error: selectError,
    data,
  } = useQuery(SELECT_FIELD_OPTIONS_QUERY, {
    variables: {
      id: productId,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isDirty, isValid },
    reset,
    watch,
    setValue,
  } = useForm<VariantFormInput>({
    mode: "onBlur",
    defaultValues,
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(defaultValues);
    }
    if (defaultValues) reset(defaultValues);
  }, [isSubmitSuccessful, reset, defaultValues]);

  if (loading) return <p>Loading...</p>;

  const {
    Type: { types },
    Fragrance: { fragrances },
    Size: { sizes },
    Asset,
  } = data;
  const typeOptions = [...types];
  const fragranceOptions = [...fragrances];
  const sizeOptions = [...sizes];
  const assetOptions = [...Asset];
  return (
    <MyModal
      afterOpenModal={afterOpenModal}
      modalIsOpen={modalIsOpen}
      closeModal={closeModal}
      heading={heading}
    >
      <form
        className="flex flex-col space-y-5 mx-5 pt-5 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <ErrorMessage error={error || selectError} />
        <fieldset className="space-y-3" disabled={loading} aria-busy={loading}>
          <div className="flex flex-col space-y-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              className="form-input w-full rounded-md"
              {...register("name", { required: "This is required" })}
              // value={queriedUpdateData?.name}
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
              // value={queriedUpdateData?.size}
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
              // value={queriedUpdateData?.type}
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
              id="fragrance"
              {...register("fragrance", {
                required: "This is required",
              })}
              className="form-select rounded-md"
              // value={queriedUpdateData?.fragrance}
            >
              {fragranceOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors?.size && <p>{errors.size.message}</p>}
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="image">Image:</label>
            <select
              {...register("image", {
                required: "This is required",
              })}
              className="form-select rounded-md"
              // value={queriedUpdateData?.image}
            >
              {assetOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors?.image && <p>{errors.image.message}</p>}
          </div>
        </fieldset>

        <input
          type="submit"
          value={operation}
          className="form-input py-2 rounded-md bg-gray-400 hover:bg-gray-200 tracking-widest"
          disabled={!isDirty || !isValid}
        />
      </form>
    </MyModal>
  );
};
