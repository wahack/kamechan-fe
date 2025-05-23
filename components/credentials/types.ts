export interface PasswordEntry {
  id: string;
  label: string;
  value: string;
  notes: string;
}

export interface PasswordGroup {
  id: string;
  name: string;
  entries: PasswordEntry[];
}
