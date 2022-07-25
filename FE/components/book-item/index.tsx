import React from "react";
import styles from "./book-item.module.css";
import { IBook } from "@/utils/types/book";
import Button from "@/atomics/button";

import { useRouter } from "next/router";

interface BookItemProps {
  book: IBook;
  btnText?: string;
}
const description = "Referring to himself as a \"consulting detective\" in the stories, Holmes is known for his proficiency with observation, deduction, forensic science and logical reasoning that borders on the fantastic, which he employs when investigating cases for a wide variety of clients, including Scotland Yard."
export default function BookItem({ book, btnText }: BookItemProps) {
  const router = useRouter();
  return (
    <div className={styles["book-item-container"]}>
      <div className="flex justify-between">  
        <img src={book?.thumbnail || "https://www.fanbolt.com/storage/2022/01/Sherlock-Holmes-3-Poster-1.jpg"} className="rounded-lg w-book-image-width-small sm:w-book-image-width" />
        <div className="pl-4 sm:px-4">
          <div className="text-2xl font-bold">{book?.name}</div>
          <div className="text-sm italic">{book?.category?.name}</div>
          <div className="w-full pb-4 text-sm sm:py-2 h-38 description-box">{book.description || description}</div>
          <div className="sm:pt-4">
            <div className="flex items-center justify-between">
              <div className="">Price: ${book?.price}</div>
              <div className="flex justify-end">
                <Button onClick={() => router.push(`/payment/${book?._id}`)}>{btnText ? btnText : "Buy"}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
