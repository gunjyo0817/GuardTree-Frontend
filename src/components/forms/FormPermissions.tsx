import React from "react";

export interface FormDefinition {
  id: string;
  name: string;
  description: string;
  allowedRoles: string[];
  allowedJobTitles: string[];
}

export const formDefinitions: FormDefinition[] = [
  { id: "form_A", name: "日常生活功能支持型態評量：A. 居家活動", description: "", allowedRoles: ["admin"], allowedJobTitles: ["教保員"] },
  { id: "form_B", name: "日常生活功能支持型態評量：B.社區生活活動", description: "", allowedRoles: ["admin"], allowedJobTitles: ["教保員"] },
  { id: "form_C", name: "日常生活功能支持型態評量：C.終身學習", description: "", allowedRoles: ["admin"], allowedJobTitles: ["教保員"] },
  { id: "form_D", name: "日常生活功能支持型態評量：D.作業活動", description: "", allowedRoles: ["admin"], allowedJobTitles: ["教保員"] },
  { id: "form_E", name: "日常生活功能支持型態評量：E.健康與安全活動", description: "", allowedRoles: ["admin"], allowedJobTitles: ["教保員"] },
  { id: "form_F", name: "日常生活功能支持型態評量：F.社交活動", description: "", allowedRoles: ["admin"], allowedJobTitles: ["教保員"] },
  { id: "form_G", name: "日常生活功能支持型態評量：G.保護與倡議活動（P&A）", description: "", allowedRoles: ["admin"], allowedJobTitles: ["教保員"] },
];

export const useFormPermissions = (
  userRole: string,
  userJobTitle: string
): FormDefinition[] => {
  // Filter forms based on user role and job title
  return formDefinitions.filter(
    (form) =>
      form.allowedRoles.includes(userRole) ||
      form.allowedJobTitles.includes(userJobTitle)
  );
};
