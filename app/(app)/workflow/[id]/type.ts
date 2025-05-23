export type Workflow = {
  id: string;
  title: string;
  description: string;
  flowchart: string;
  nodes: {
    name: string;
    logoUrl: string;
  }[];
  user: {
    name: string
  }
}