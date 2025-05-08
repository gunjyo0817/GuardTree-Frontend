
import React from "react";

export interface FormDefinition {
  id: string;
  name: string;
  description: string;
  allowedRoles: string[];
  allowedJobTitles: string[];
}

export const formDefinitions: FormDefinition[] = [
  {
    id: "basic-ability-checklist",
    name: "基本能力檢核表",
    description: "評估案主在日常生活與社交能力的基本檢核",
    allowedRoles: ["admin"],
    allowedJobTitles: ["社工"],
  },
  {
    id: "daily-life-function-b",
    name: "日常生活功能支持型態評量 – B 版",
    description: "評估案主日常生活功能與所需支持型態",
    allowedRoles: ["admin"],
    allowedJobTitles: ["教保員"],
  }
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
