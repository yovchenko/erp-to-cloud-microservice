/**
 * TypeScript export types
 */

export type CustomField = {
  id: string;
  value: string;
  type?: string;
  title?: string;
  settings?: {
    inheritanceType: string;
  };
};

export type Folder = {
  kind: string;
  data: Project[];
};

export type Tasks = {
  kind: string;
  data: Task[];
};

export type CustomFields = {
  kind: string;
  data: CustomField[];
};

export type Project = {
  id: string;
  title: string;
  workflowId?: string;
  parentIds?: string[];
  childIds?: string[];
  customFields?: CustomField[];
  permalink?: string;
};

export type Task = {
  id: string;
  title: string;
  parentIds: string[];
  superParentIds: string[];
  customFields: CustomField[];
  superTaskIds: string[];
  permalink: string;
  subTaskIds: [];
};

export type Users = {
  kind: string;
  data: User[];
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  profiles: [
    {
      email: string;
    }
  ];
};

export type BudgetResponse = {
  "#ns": string;
  "#type": string | "Empty";
  "#value": BudgetProject[];
};

export type BudgetProject = {
  project: string;
  posted: boolean;
  number: string;
  amount: number;
  currency: string;
  efforts: BudgetSubProject[];
};

export type BudgetSubProject = {
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
};

export type BudgetData = {
  "#ns": string;
  "#type": string | "Empty";
  "#value": BudgetValue;
};

export type BudgetValue = {
  message: string;
  projects: Array<string>;
};

export type SpecificationValue = {
  message: string;
  specifications: Array<string>;
};

export type BudgetMessage = {
  "#ns": string;
  "#type": string | "Empty";
  "#value": BudgetMessageValue[] | [];
};

export type BudgetMessageValue = {
  message: string;
  status: string | "sent";
  count: string;
};

export type BudgetDelete = {
  "#ns": string;
  "#type": string;
  "#value": {
    result: string | "success";
  };
};

export type LocalBudgetValue = {
  status: string;
  delete: boolean;
  value: BudgetValue | SpecificationValue;
};

export type BudgetTotal = {
  [key: string]: number;
};

export type GroupedProjects = {
  [key: string]: [Project];
};

export type SpaceInfo = {
  id: number;
  space_id: string;
  project_title: string;
  erp_work_type: string;
  workflow_id: string;
};

export type TableInfo = {
  urlMessage: string;
  urlData: string;
  columnHeaders: string[];
};
