import type { RequestResponse } from "../interface/Request.interface";
import Header from "./Header";
import RequestCard from "./RequestCard";

interface RequestViewProps {
  requests: RequestResponse[];
}

export default function RequestView({ requests }: RequestViewProps) {
  return (
    <>
      <Header />
      <section className="py-24">
        <div className="grid grid-cols-1 gap-4 px-16 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
          {requests.map((request) => (
            <RequestCard key={request.request_id} {...request} />
          ))}
        </div>
      </section>
    </>
  );
}