export interface FormItem {
  activity: string;
  item: string;
  subitem?: string | null;
  core_area: string;
  support_type?: number | null;
}

export interface FormRecordCreate {
  case_id: number;
  user_id: number;
  year: number;
  form_A: FormItem[];
  form_B: FormItem[];
  form_C: FormItem[];
  form_D: FormItem[];
  form_E: FormItem[];
  form_F: FormItem[];
  form_G: FormItem[];
}

export interface FormRecord extends FormRecordCreate {
  id: number;
  created_at: string; // ISO string
  updated_at: string; // ISO string
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
  updated_at: string; // ISO string
  case_name?: string | null;
  user_name?: string | null;
}

export interface FormRecordUpdate {
  year?: number;
  form_A?: FormItem[];
  form_B?: FormItem[];
  form_C?: FormItem[];
  form_D?: FormItem[];
  form_E?: FormItem[];
  form_F?: FormItem[];
  form_G?: FormItem[];
}