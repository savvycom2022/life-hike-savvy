import { useState, useEffect } from "react";
import { IBook } from "@/utils/types/book";
import { getBookById } from "@/services/books";
import { createOrder } from "@/services/order";
import { useRouter } from "next/router";

export default function usePayment() {
  const router = useRouter();
  const [bookId, setBookId] = useState("0");
  const [book, setBook] = useState<IBook | null>(null);
  const onCreateOrder = async (username: string, phone: string) => {
    if (!book) return;
    const createOrderObj = {
      bookId: book._id,
      productId: book.productId,
      priceId: book.priceId,
      username,
      phone,
      quantity: 1,
    };
    const response = await createOrder(createOrderObj);
    console.log('response', response)
      window.open(response?.paymentUrl, '_blank');
  };

  const getBook = async () => {
    const book = await getBookById(bookId);
    setBook(book);
  };
  useEffect(() => {
    if (!router.isReady) return;
    setBookId(`${router.query?.id}`);
  }, [router.isReady]);
  useEffect(() => {
    if (!bookId) return;
    getBook();
  }, [bookId]);
  return { book, onCreateOrder };
}
