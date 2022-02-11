import { DocumentNode, useQuery } from "@apollo/client";

export function useUpdateQuery(query: DocumentNode, variables?: object) {
  const { data, error, loading } = useQuery(query, { variables });
  if(error) return error;
  if(data) return data;
}
