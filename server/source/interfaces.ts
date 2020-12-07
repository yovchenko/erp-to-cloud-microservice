/**
 * TypeScript export interfaces
 */

export interface CustomField {
  id: string;
  value: string;
  type?: string;
  title?: string;
  settings?: {
    inheritanceType: string;
  };
}

export interface Folder {
  kind: string;
  data: Project[];
}

export interface Tasks {
  kind: string;
  data: Task[];
}

export interface CustomFields {
  kind: string;
  data: CustomField[];
}

export interface Project {
  id: string;
  title: string;
  workflowId?: string;
  parentIds?: string[];
  childIds?: string[];
  customFields?: CustomField[];
  permalink?: string;
}

export interface Task {
  id: string;
  title: string;
  parentIds: string[];
  superParentIds: string[];
  customFields: CustomField[];
  superTaskIds: string[];
  permalink: string;
  subTaskIds: [];
}

export interface Users {
  kind: string;
  data: User[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  profiles: [
    {
      email: string;
    }
  ];
}

export interface BudgetResponse {
  "#ns": string;
  "#type": string | "Empty";
  "#value": BudgetProject[];
}

export interface BudgetProject {
  project: string;
  posted: boolean;
  number: string;
  amount: number;
  currency: string;
  efforts: BudgetSubProject[];
}

export interface BudgetSubProject {
  N: string;
  product: string;
  productCode: string;
  unit: string;
  quantity: number;
  specification: string;
  workType: string;
  work: string;
  hourBudget: number;
  effortBudget: number;
  totalBudget: number;
  tripBudget: number;
}

export interface BudgetData {
  "#ns": string;
  "#type": string | "Empty";
  "#value": BudgetValue;
}

export interface BudgetValue {
  message: string;
  projects: Array<string>;
}

export interface SpecificationValue {
  message: string;
  specifications: Array<string>;
}

export interface BudgetMessage {
  "#ns": string;
  "#type": string | "Empty";
  "#value": BudgetMessageValue[] | [];
}

export interface BudgetMessageValue {
  message: string;
  status: string | "sent";
  count: string;
}

export interface BudgetDelete {
  "#ns": string;
  "#type": string;
  "#value": {
    result: string | "success";
  };
}

export interface LocalBudgetValue {
  status: string;
  delete: boolean;
  value: BudgetValue | SpecificationValue;
}

export interface BudgetTotal {
  [key: string]: number;
}

export interface GroupedProjects {
  [key: string]: [Project];
}

export interface SpaceInfo {
  id: number;
  space_id: string;
  project_title: string;
  erp_work_type: string;
  workflow_id: string;
}

export interface TableInfo {
  urlMessage: string;
  urlData: string;
  columnHeaders: string[];
}
