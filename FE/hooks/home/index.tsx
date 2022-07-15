import { useState, useEffect } from "react";
import { getListBooksService } from "@/services/books";
import { IBook } from "@/utils/types/book";
export default function useHome() {
  const [page, setPage] = useState(0);
  const [listCats, setListCats] = useState([]);
  const [listBooks, setListBooks] = useState<IBook[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loadMore = () => {
    getListBook();
    // setPage(page => page+1);
  };
  const getListBook = async () => {
    const data = await getListBooksService(page, 10);
    if (!data.items?.length) setHasMore(false);
    setListBooks([...listBooks, ...data?.items]);
    setPage(page + 1);
  };

  return { listBooks, loadMore, hasMore };
}
