export enum EBookCategory {
  fiction= "Fiction",
  comic= "Comic",
  dictionary= "Dictionary",
}

export interface IBookCat {
  _id: string;
  name: string;
  __v: number;
}

export interface IBook {
  _id: string;
  name: string;
  category: IBookCat;
  price: number;
  thumbnail: string;
  productId?: string;
  priceId?: string;
  description?: string;
}