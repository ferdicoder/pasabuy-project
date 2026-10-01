import type { RequestResponse } from "../interface/Request.interface";
import { API } from "../config/api";
import { queryKeys } from "../config/queryKeys";
import { useFetch } from "../hooks/useAPI";
import LoadingSpinner from "../components/LoadingSpinner";
import RequestView from "../components/RequestView";


export default function RequestPage() {
  const { data: requests, isPending, isError, error } = useFetch<RequestResponse[]>(
    queryKeys.requests,
    API.request.getAll
  );

  if (isPending) return <LoadingSpinner />;
  if (isError) return <p className="py-24 text-center text-red-500">{error.message}</p>;

  return <RequestView requests={requests ?? []} />;
}