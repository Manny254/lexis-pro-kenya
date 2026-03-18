export type UserRole = 'admin' | 'attorney' | 'staff';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  lskNumber?: string;
}

export type ClientStatus = 'Active' | 'Consultation' | 'Closed';
export type Priority = 'High' | 'Medium' | 'Low';

export const CASE_TYPES = [
  'Land Dispute', 'Conveyancing', 'Criminal Defense', 'Family Law',
  'Commercial Dispute', 'Constitutional Petition', 'Employment / Labour',
  'Succession / Probate', 'Judicial Review', 'Debt Recovery',
  'Intellectual Property', 'Immigration', 'Personal Injury', 'Tax Dispute',
] as const;
export type CaseType = typeof CASE_TYPES[number];

export const KENYAN_COURTS = [
  'Supreme Court of Kenya',
  'Court of Appeal – Nairobi',
  'High Court – Milimani',
  'High Court – Mombasa',
  'High Court – Kisumu',
  'High Court – Nakuru',
  'Employment & Labour Court – Nairobi',
  'Environment & Land Court – Nairobi',
  'Milimani Commercial Courts',
  'Nairobi Magistrate Court',
  'Mombasa Magistrate Court',
  'Kisumu Chief Magistrate Court',
  'Eldoret Magistrate Court',
  'Anti-Corruption Court',
  "Children's Court – Nairobi",
] as const;

export const KENYAN_COUNTIES = [
  'Nairobi', 'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita-Taveta',
  'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi',
  'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga',
  "Murang'a", 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia',
  'Uasin Gishu', 'Elgeyo-Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru',
  'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma',
  'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira',
] as const;

export const CASE_STAGES = ['Filing', 'Pre-Trial', 'Mediation', 'Hearing', 'Judgment', 'Appeal', 'Closed'] as const;
export type CaseStage = typeof CASE_STAGES[number];

export const HEARING_TYPES = ['Mention', 'Pre-Trial', 'Mediation', 'Hearing', 'Judgment', 'Ruling', 'Appeal'] as const;
export type HearingType = typeof HEARING_TYPES[number];

export const DOC_TYPES = [
  'Court Pleading', 'Title Document', 'Contract', 'Affidavit',
  'Correspondence', 'Evidence', 'Invoice', 'Other',
] as const;
export type DocType = typeof DOC_TYPES[number];

export const COMM_TYPES = ['Call', 'Email', 'WhatsApp', 'Meeting', 'Note'] as const;
export type CommType = typeof COMM_TYPES[number];

export type TaskStatus = 'Pending' | 'In Progress' | 'Done';
export type InvoiceStatus = 'Paid' | 'Pending' | 'Partial';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  caseType: CaseType;
  status: ClientStatus;
  priority: Priority;
  location: string;
  notes: string;
  date: string;
  lskRef: string;
  tags: string[];
}

export interface Case {
  id: string;
  clientId: string;
  title: string;
  court: string;
  caseNo: string;
  stage: CaseStage;
  nextHearing: string;
  filingDate: string;
  advocate: string;
  description: string;
}

export interface Hearing {
  id: string;
  caseId: string;
  clientId: string;
  title: string;
  court: string;
  date: string;
  time: string;
  type: HearingType;
  judge: string;
  notes: string;
}

export interface Document {
  id: string;
  clientId: string;
  caseId?: string;
  name: string;
  size: string;
  type: DocType;
  fileExt: string;
  uploaded: string;
  uploadedBy: string;
  version: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  description: string;
  hours: number;
  rateKES: number;
  invoiceNo: string;
  status: InvoiceStatus;
  date: string;
  mpesaRef?: string;
}

export interface TimeEntry {
  id: string;
  clientId: string;
  caseId?: string;
  description: string;
  minutes: number;
  date: string;
  user: string;
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  deadline: string;
  clientId?: string;
  caseId?: string;
  status: TaskStatus;
  priority: Priority;
}

export interface Message {
  id: string;
  clientId: string;
  type: CommType;
  content: string;
  date: string;
  author: string;
  followUp?: string;
}
