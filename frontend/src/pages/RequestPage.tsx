import type { RequestResponse } from "../interface/Request.interface";
import { API } from "../config/api";
import { queryKeys } from "../config/queryKeys";

import { useFetch } from "../hooks/useAPI";
import Header from "../components/Header";
import RequestCard from "../components/RequestCard";

export default function RequestPage() {
  const { data: reqData, isPending, isError, error } = useFetch<RequestResponse[]>(
    queryKeys.requests,
    API.request.getAll
  );

  if (isPending) return <p className="text-center py-24">Loading requests…</p>;
  if (isError) return <p className="text-center py-24 text-red-500">{error.message}</p>;

  return (
    <>
      <Header username="Current User" />

      <section className="py-24">
        <div className="grid grid-cols-1 2xl:grid-cols-6 md:grid-cols-3 xl:grid-cols-4 sm:grid-cols-2 gap-4 px-16">
          {reqData.map((req) => (
            <RequestCard key={req.request_id} {...req} />
          ))}
        </div>
      </section>
    </>
  );
}