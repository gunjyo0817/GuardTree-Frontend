export interface FormItem {
  activity: string;
  item: string;
  subitem?: string | null;
  core_area: string;
  support_type: number;
}

export interface FormRecordCreate {
  case_id: number;
  user_id: number;
  year: number;
  form_type: string; // FormType ("A" | "B" | ...)
  content: FormItem[];
}

export interface FormRecord extends FormRecordCreate {
  id: number;
  created_at: string; // ISO string
}

export interface FormRecordResponse extends FormRecord {
  case_name?: string | null;
  user_name?: string | null;
}

export interface FormMetadata {
  id: number;
  case_id: number;
  user_id: number;
  created_at: string; // ISO string
  year: number;
  form_type: string; // FormType
  case_name?: string | null;
  user_name?: string | null;
}