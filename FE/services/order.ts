
const axios = require("axios").default;
const apiUrl = "http://localhost:3003";

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
  return data.data.data;
}

export const getOrderById = async (id: string) => {
  const data = await axios.get(`${apiUrl}/order/${id}`);
  return data.data.data;
}