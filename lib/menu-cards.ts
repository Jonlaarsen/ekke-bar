export type MenuCard = {
  id: number;
  title: string;
  image_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type MenuCardInput = {
  title: string;
  image_url: string;
  sort_order?: number;
};
