export interface Code {
  id: string;
  code: string;
  credits: number;
  maxUses: number;
  usedBy: string[];
  created_at: string;
  expires_at: string;
  is_active: boolean;
}
