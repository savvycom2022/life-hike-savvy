import { IBook } from "@/utils/types/book";
const axios = require("axios").default;
const listBooks = require("./books.json");
// const apiUrl = process.env.API_URL;
// const apiUrl = "http://nartsoftware.com";
const apiUrl = "http://localhost:3003";


export const getCategories = async () => {
  let response = await axios.get(`${apiUrl}/category`);
  return { cats: response.data.items, count: response.data.count };
};

export const getListBooksService = async (page: number, limit: number) => {
  const response = await axios.get(
    `${apiUrl}/book?limit=${limit}&offset=${page * limit}`
  );
  return { items: response.data.data.items, count: response.data.data.total };
};

export const getBookById = async (id: string): Promise<IBook | null> => {
  if(id === "0")
    return null;
  const data = await axios.get(`${apiUrl}/book/${id}`);  
  return data.data.data;
};


interface IOrder {
  bookId: string;
  productId?: string;
  priceId?: string;
  username: string;
  phone: string;
  quantity: number;
}
export const createOrder = async (order: IOrder) => {
  const data = await axios.post(`${apiUrl}/order`, order);
  console.log('data', data)
  return data;
}
