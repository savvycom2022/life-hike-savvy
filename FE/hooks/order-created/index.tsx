import { useState, useEffect } from "react";
import { getOrderById } from "@/services/order";

export default function useOrderCreated(id: string) {
  const [order, setOrder] = useState<any>(null);
  useEffect(() => {
    if(id === "undefined") return;
    const getBook = async () => {
      const orderData = await getOrderById(id);
      setOrder(orderData);
    };
    getBook();
  }, [id]);
  return { order };
}
