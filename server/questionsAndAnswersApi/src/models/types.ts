export type Question = {
  id: number;
  body: string;
  product_id: number;
  date_written: bigint;
  asker_name: string;
  asker_email: string;
  reported: boolean;
  helpful: number;
};
export type Answer = {
  id: number;
  question_id: number;
  body: string;
  date_written: bigint;
  answerer_name: string;
  answerer_email: string;
  reported: boolean;
  helpful: number;
  Photos: object[] | [];
};

export type Photo = {
  id: number | null;
  url: string | null;
};
