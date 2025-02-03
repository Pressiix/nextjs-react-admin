type User = {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

type SignInResponse = {
  jwt: string;
  user: User;
};

export type { User, SignInResponse };
