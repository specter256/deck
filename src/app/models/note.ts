export interface Note {
  id?: string;
  title?: string;
  content?: string;
  created_at?: any;
  updated_at?: any;
  user_id?: string;
  tags?: string[];
  order?: number;
  deleted?: boolean;
}
