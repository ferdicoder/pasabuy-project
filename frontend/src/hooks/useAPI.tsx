import axios, { type AxiosError } from 'axios';
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';

export const api = axios.create({
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    return axiosErr.response?.data?.message || axiosErr.message || 'Request failed';
  }
  return error instanceof Error ? error.message : 'Request failed';
}

export function useFetch<T>(
  queryKey: readonly unknown[],
  url: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      try {
        const res = await api.get<T>(url);
        return res.data;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    ...options,
  });
}

export function usePost<TPayload, TResponse = TPayload>(
  url: string,
  invalidateKey: readonly unknown[]
) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, Error, TPayload>({
    mutationFn: async (payload) => {
      try {
        const res = await api.post<TResponse>(url, payload);
        return res.data;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invalidateKey });
    },
  });
}

export function usePatch<TPayload, TResponse = TPayload>(
  url: string,
  invalidateKey: readonly unknown[]
) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, Error, { id: string; payload: TPayload }>({
    mutationFn: async ({ id, payload }) => {
      try {
        const res = await api.patch<TResponse>(`${url}/${id}`, payload);
        return res.data;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invalidateKey });
    },
  });
}

export function useDelete(url: string, invalidateKey: readonly unknown[]) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      try {
        await api.delete(`${url}/${id}`);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invalidateKey });
    },
  });
}

export function useSession<T = unknown>(url: string, queryKey: readonly unknown[]) {
  return useQuery<T | null>({
    queryKey,
    queryFn: async () => {
      try {
        const res = await api.get<T>(url);
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) return null;
        throw new Error(getErrorMessage(error));
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}