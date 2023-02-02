export interface Crisp {
  article_id?: string;
  title?: string;
  status?: string;
  visibility?: string;
  featured?: boolean;
  visits?: number;
  order?: number;
  url?: string;
  created_at?: number;
  updated_at?: number;
  published_at?: number;
  category?: Category;
}

export interface Category {
  category_id?: string;
  name?: string;
  color?: null;
  section?: null;
}

export interface CrispResponse {
  error?: boolean;
  reason?: string;
  data?: CrispArticle;
}

export interface CrispArticle {
  article_id?: string;
  title?: string;
  status?: string;
  visibility?: string;
  featured?: boolean;
  visits?: number;
  order?: number;
  url?: string;
  created_at?: number;
  updated_at?: number;
  published_at?: number;
  description?: string;
  content?: string;
  html?: string;
  category?: Category | null;
}
