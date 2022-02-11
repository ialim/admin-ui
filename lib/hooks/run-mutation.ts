import { useCallback } from "react";
import { Message } from "../../types/types";

export const useRunMutationFunction = (
  mutationFunction: Function,
) => {
  const mutation = useCallback(
    async (
      variables: any,
      type: string,
    ): Promise<Message> => {
      const isArray = Array.isArray(variables);
      try {
        const res = await mutationFunction({
          ...(isArray ? { variables: { variables } } : {variables}),
        });
        return { type, ok: true, data: res?.data };
      } catch (error: any) {
        return { type, ok: false, error };
      }
    },
    [mutationFunction]
  );
  return mutation;
};
