import { gql, useMutation, useQuery } from "@apollo/client";
import Router from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "../components/error-message";
import { ALL_PRODUCTS_QUERY } from "./products";

type Option = {
  label: string;
  value: string;
};

type FormInput = {
  name: string;
  slug: string;
  description: string;
  brand: string;
  status: string;
  gender: string;
  notes: string[];
  image: any;
};

type CreateProductInput = {
  name: string;
  slug: string;
  description: string;
  status: string;
  featuredAsset?: any;
  facetValues?: any[];
};

let brandOptions: Option[] = [
    { label: "Available", value: "AVAILABLE" },
    { label: "Draft", value: "DRAFT" },
    { label: "Unavailable", value: "UNAVAILABLE" },
  ],
  genderOptions: Option[] = [
    { label: "Available", value: "AVAILABLE" },
    { label: "Draft", value: "DRAFT" },
    { label: "Unavailable", value: "UNAVAILABLE" },
  ],
  noteOptions: Option[] = [
    { label: "Available", value: "AVAILABLE" },
    { label: "Draft", value: "DRAFT" },
    { label: "Unavailable", value: "UNAVAILABLE" },
  ];

const statusOptions = [
  { label: "Available", value: "AVAILABLE" },
  { label: "Draft", value: "DRAFT" },
  { label: "Unavailable", value: "UNAVAILABLE" },
];

const SELECT_FIELD_OPTIONS_QUERY = gql`
  query SELECT_FIELD_OPTIONS_QUERY {
    Brand: Facet(where: { name: "Brand" }) {
      brands: values(orderBy: { name: asc }) {
        value: id
        label: name
      }
    }
    Gender: Facet(where: { name: "Gender" }) {
      genders: values(orderBy: { name: asc }) {
        value: id
        label: name
      }
    }
    Note: Facet(where: { name: "Note" }) {
      notes: values(orderBy: { name: asc }) {
        value: id
        label: name
      }
    }
  }
`;

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    $name: String!
    $description: String
    $slug: String
    $status: String
    $featuredAsset: Upload
    $facetValues: [FacetValueWhereUniqueInput]
  ) {
    createProduct(
      data: {
        name: $name
        slug: $slug
        description: $description
        status: $status
        featuredAsset: { create: { image: $featuredAsset, altText: $name } }
        facetValues: { connect: $facetValues }
      }
    ) {
      id
      name
      description
    }
  }
`;

const AddProducts = () => {
  const selectOptions = useQuery(SELECT_FIELD_OPTIONS_QUERY);

  let createProductInput: CreateProductInput = {
    name: "",
    description: "",
    slug: "",
    status: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
    watch,
    setValue,
  } = useForm<FormInput>({
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      status: "",
      brand: "1",
      gender: "1",
    },
  });

  const slug = watch("name").replace(/ /g, "_").toLowerCase();
  const [createProduct, { loading, error, data }] = useMutation(
    CREATE_PRODUCT_MUTATION
  );

  const onSubmit = async (data: FormInput) => {
    const { name, slug, description, status, image, brand, gender, notes } =
      data;
    createProductInput = {
      name,
      slug,
      description,
      status,
      featuredAsset: image[0],
    };
    createProductInput.facetValues = [
      { id: brand },
      { id: gender },
      ...notes.map((note) => {
        return { id: note };
      }),
    ];

    const res = await createProduct({
      variables: createProductInput,
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
    });
    Router.push({
      pathname: `product/${slug}/${res.data.createProduct.id}`,
    });
    console.log(res);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        name: "",
        description: "",
        slug: "",
        status: "",
        brand: "1",
        gender: "1",
      });
    }
  }, [isSubmitSuccessful, reset]);

  if (selectOptions.loading) return <p>Loading...</p>;

  const {
    Brand: { brands },
    Gender: { genders },
    Note: { notes },
  } = selectOptions.data;
  brandOptions = [...brands];
  genderOptions = [...genders];
  noteOptions = [...notes];

  return (
    <div className="px-2 bg-gray-50 divide-y-2 divide-gray-400 divide-solid py-3 rounded-md">
      <header className="mx-5 py-3 text-xl ">Create New Product</header>
      <form
        className="flex flex-col space-y-5 mx-5 pt-5 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <ErrorMessage error={error || selectOptions.error} />
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
            <label htmlFor="slug">Slug:</label>
            <input
              type="text"
              value={slug}
              className="form-input flex flex-col w-full rounded-md"
              {...register("slug", { required: "This is required" })}
            />
            {errors?.slug && <p>{errors.slug.message}</p>}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="description">Description:</label>
            <textarea
              className="form-textarea flex flex-col w-full rounded-md"
              {...register("description", { required: "This is required" })}
            />
            {errors?.description && <p>{errors.description.message}</p>}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="brand">Brand:</label>
            <select
              {...register("brand", {
                required: "This is required",
              })}
              className="form-select rounded-md"
            >
              {brandOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors?.brand && <p>{errors.brand.message}</p>}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="status">Status:</label>
            <select {...register("status")} className="form-select rounded-md">
              {statusOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="status">Gender:</label>
            <select
              {...register("gender", {
                required: "This is required",
              })}
              className="form-select rounded-md"
            >
              {genderOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors?.gender && <p>{errors.gender.message}</p>}
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="status">Notes:</label>
            <select
              multiple
              {...register("notes")}
              className="form-multiselect rounded-md"
            >
              {noteOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="slug">Image:</label>
            <input
              type="file"
              className="form-input flex flex-col w-full rounded-md"
              {...register("image")}
            />
          </div>
        </fieldset>

        <input
          type="submit"
          value="CREATE"
          className="form-input py-2 rounded-md bg-gray-100 hover:bg-gray-200 tracking-widest"
        />
      </form>
    </div>
  );
};

export default AddProducts;
