import Button from "@/atomics/button";
import { useRouter } from "next/router";
import React from "react";
import useOrderCreated from "@/hooks/order-created";
import BookItem from "@/components/book-item";
import PageHeader from "@/components/page-header";
export default function OrderCreated() {
  const router = useRouter();
  const { id } = router.query;
  const { order } = useOrderCreated(id + "");
  return (
    <>
      <PageHeader title="Order Created" />
      <main className="flex flex-col items-center justify-center h-screen p-4">
        <div className="w-full h-auto px-4 py-4 pt-8 m-auto mt-10 rounded-md sm:w-4/5 md:w-3/4 max-w-600 sm:py-2">
          <div className="flex flex-col items-center justify-center h-3/4">
            <div>
              <span>Username: &nbsp;</span>
              <span>{order?.order?.username}</span>
            </div>
            <div>
              <span>Phone: &nbsp;</span>
              <span>{order?.order?.phone}</span>
            </div>
            {order?.book && <BookItem book={order?.book} btnText="Buy more" />}
            <div className="flex justify-center pt-8">
              <Button onClick={() => router.push(`/`)}>Back to Home</Button>
            </div>
          </div>
        </div>
        <br />
      </main>
    </>
  );
}
