import { DocumentNode, useMutation } from "@apollo/client";

interface DeleteButtonProps {
  id: string;
  query: DocumentNode;
}

const update = (cache: any, payload: any) => {
  cache.evict(cache.identify(payload.data.deleteProductVariant));
};

export const DeleteButton = ({ id, query }: DeleteButtonProps) => {
  const [deleteProductVariant, result] = useMutation(query, {
    variables: { id },
    update,
  });

  const onClick = async () => {
    if (confirm("Are you sure you want to delete this Product Variant")) {
      const res = await deleteProductVariant().catch((err) =>
        alert(err.message)
      );
    }
  };

  return (
    <button
      className="flex flex-row p-3 rounded-lg shadow-lg text-white uppercase tracking-wide font-semibold bg-gray-400 text-sm w-20 text-center"
      disabled={result.loading}
      onClick={() => onClick()}
    >
      Delete
    </button>
  );
};
