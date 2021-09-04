import { useCallback } from "react";
import { Message } from "../../types/types";

export const useRunMutationFunction = async (
  mutationFunction: Function,
  variables: any,
  type: string
) => {
  const mutation = useCallback(
    async (
      mutationFunction: Function,
      variables: any,
      type: string
    ): Promise<Message> => {
      const isArray = Array.isArray(variables);
      try {
        const res = await mutationFunction({
          ...(isArray ? { variable: { variables } } : variables),
        });
        return { type, ok: true, data: res.data };
      } catch (error) {
        return { type, ok: false, error };
      }
    },
    []
  );
  return await mutation;
};
