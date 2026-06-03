export interface Product{
  productId: string
  userId: number
  name: string
  quantity: number
}

export type addProductBody = Omit<Product, "productId">

export type changeProductBody = Pick<Product, "name" | "quantity"> 