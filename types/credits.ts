export interface Credits {
  id: string;
  userId: string;
  actual: number;
  spent: number;
  transactions: Transaction[];
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: "generate" | "buy" | "code" | "free";
  paymentMethod?: "cash" | "card" | "bank_transfer";
  code?: string;
  createdAt: string;
  updatedAt: string;
}
