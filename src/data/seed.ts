import type { Client, Case, Hearing, Document, Task, Message, Lead } from '@/types';

export const DEMO_USERS = [
  { id: 'u1', email: 'admin@lexiskenya.co.ke',    password: 'admin123', name: 'Amina Waweru',   role: 'admin'    as const, lskNumber: 'LSK/ADV/2019/4821' },
  { id: 'u2', email: 'advocate@lexiskenya.co.ke', password: 'adv123',   name: 'David Otieno',  role: 'attorney' as const, lskNumber: 'LSK/ADV/2015/3102' },
  { id: 'u3', email: 'staff@lexiskenya.co.ke',    password: 'staff123', name: 'Grace Muthoni', role: 'staff'    as const },
];

const today = new Date();
const daysFromNow = (d: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().split('T')[0];
};
const daysAgo = (d: number) => daysFromNow(-d);

export const SEED_CLIENTS: Client[] = [
  {
    id: 'c1', name: 'Kariuki Mwangi', email: 'kariuki@gmail.com', phone: '+254 722 456 789',
    caseType: 'Land Dispute', status: 'Active', priority: 'High', location: 'Nairobi',
    notes: 'Adverse possession claim on 0.5 acre plot in Ruiru. Adverse claimant has been in occupation since 2008.',
    date: daysAgo(45), lskRef: 'LSK/FILE/2026/0021', tags: ['Land', 'Urgent'],
  },
  {
    id: 'c2', name: 'Fatuma Hassan', email: 'fatuma@seafood.co.ke', phone: '+254 733 887 654',
    caseType: 'Commercial Dispute', status: 'Active', priority: 'Medium', location: 'Mombasa',
    notes: 'Breach of contract by supplier. KES 4.5M outstanding debt. Parties failed mediation in January.',
    date: daysAgo(30), lskRef: 'LSK/FILE/2026/0022', tags: ['Commercial'],
  },
  {
    id: 'c3', name: 'Peter Njoroge', email: 'peter.njoroge@yahoo.com', phone: '+254 712 334 455',
    caseType: 'Succession / Probate', status: 'Consultation', priority: 'Low', location: 'Nakuru',
    notes: 'Father deceased intestate. 3 heirs disputing 10-acre farm in Njoro. Initial consultation done.',
    date: daysAgo(12), lskRef: 'LSK/FILE/2026/0023', tags: ['Succession'],
  },
  {
    id: 'c4', name: 'Wanjiku Kamau', email: 'wanjiku.k@teacher.go.ke', phone: '+254 701 223 344',
    caseType: 'Employment / Labour', status: 'Active', priority: 'High', location: 'Nairobi',
    notes: 'Wrongful dismissal by Nairobi City County. 14 years of service. Claiming reinstatement + 3 years salary.',
    date: daysAgo(60), lskRef: 'LSK/FILE/2026/0024', tags: ['Labour', 'County Gov'],
  },
  {
    id: 'c5', name: 'Odhiambo & Sons Ltd', email: 'info@odhiambo-sons.co.ke', phone: '+254 756 112 233',
    caseType: 'Tax Dispute', status: 'Closed', priority: 'Low', location: 'Kisumu',
    notes: 'KRA assessment dispute resolved. Reduced penalty from KES 2.1M to KES 450K via objection process.',
    date: daysAgo(90), lskRef: 'LSK/FILE/2026/0025', tags: ['Tax', 'KRA'],
  },
];

export const SEED_CASES: Case[] = [
  {
    id: 'cs1', clientId: 'c1', title: 'Mwangi v. Kamau — Land Dispute Ruiru',
    court: 'Environment & Land Court – Nairobi', caseNo: 'ELC/E/021/2026',
    stage: 'Hearing', nextHearing: daysFromNow(2), filingDate: daysAgo(40),
    advocate: 'David Otieno', description: 'Adverse possession claim. Plaintiff seeks orders for eviction and title confirmation.',
  },
  {
    id: 'cs2', clientId: 'c2', title: 'Hassan v. Bahari Supplies Ltd — Debt Recovery',
    court: 'Milimani Commercial Courts', caseNo: 'COMM/E/089/2026',
    stage: 'Pre-Trial', nextHearing: daysFromNow(6), filingDate: daysAgo(25),
    advocate: 'Amina Waweru', description: 'Recovery of KES 4.5M for goods delivered but not paid for. Defendant denies delivery.',
  },
  {
    id: 'cs3', clientId: 'c4', title: 'Kamau v. Nairobi City County — Wrongful Dismissal',
    court: 'Employment & Labour Court – Nairobi', caseNo: 'ELRC/E/112/2025',
    stage: 'Judgment', nextHearing: daysFromNow(14), filingDate: daysAgo(55),
    advocate: 'David Otieno', description: 'Claimant seeks reinstatement and back pay after 14 years of service.',
  },
];

export const SEED_HEARINGS: Hearing[] = [
  {
    id: 'h1', caseId: 'cs1', clientId: 'c1', title: 'Main Hearing — Mwangi Land Dispute',
    court: 'Environment & Land Court – Nairobi', date: daysFromNow(2), time: '9:00 AM',
    type: 'Hearing', judge: 'Hon. Justice R. Mutua', notes: 'Prepare witness list and survey report exhibit.',
  },
  {
    id: 'h2', caseId: 'cs2', clientId: 'c2', title: 'Pre-Trial Conference — Hassan Debt Recovery',
    court: 'Milimani Commercial Courts', date: daysFromNow(6), time: '2:30 PM',
    type: 'Pre-Trial', judge: 'Hon. Justice P. Kariuki', notes: 'Bring original delivery notes and invoices.',
  },
  {
    id: 'h3', caseId: 'cs3', clientId: 'c4', title: 'Judgment Delivery — Kamau v. NCC',
    court: 'Employment & Labour Court – Nairobi', date: daysFromNow(14), time: '10:00 AM',
    type: 'Judgment', judge: 'Hon. Justice A. Ochieng', notes: 'Ensure client is present. Prepare for possible appeal if ruling adverse.',
  },
  {
    id: 'h4', caseId: 'cs1', clientId: 'c1', title: 'Ruling — Survey Report Admissibility',
    court: 'Environment & Land Court – Nairobi', date: daysAgo(7), time: '11:00 AM',
    type: 'Ruling', judge: 'Hon. Justice R. Mutua', notes: 'Ruling was in favour. Survey report admitted.',
  },
];

export const SEED_DOCUMENTS: Document[] = [
  {
    id: 'd1', clientId: 'c1', caseId: 'cs1', name: 'Title_Deed_LR_45678.pdf',
    size: '2.4 MB', type: 'Title Document', fileExt: 'pdf', uploaded: daysAgo(38), uploadedBy: 'Amina Waweru', version: 1,
  },
  {
    id: 'd2', clientId: 'c1', caseId: 'cs1', name: 'Plaint_ELC_021_2026.docx',
    size: '156 KB', type: 'Court Pleading', fileExt: 'docx', uploaded: daysAgo(40), uploadedBy: 'David Otieno', version: 2,
  },
  {
    id: 'd3', clientId: 'c2', caseId: 'cs2', name: 'Supply_Agreement_Hassan_Bahari.pdf',
    size: '890 KB', type: 'Contract', fileExt: 'pdf', uploaded: daysAgo(28), uploadedBy: 'Amina Waweru', version: 1,
  },
  {
    id: 'd4', clientId: 'c4', caseId: 'cs3', name: 'Dismissal_Letter_NCC_2025.pdf',
    size: '340 KB', type: 'Evidence', fileExt: 'pdf', uploaded: daysAgo(55), uploadedBy: 'David Otieno', version: 1,
  },
];

export const SEED_TASKS: Task[] = [
  {
    id: 'tk1', title: 'File witness statements for ELC/E/021/2026', assignedTo: 'David Otieno',
    deadline: daysFromNow(1), clientId: 'c1', caseId: 'cs1', status: 'Pending', priority: 'High',
  },
  {
    id: 'tk2', title: 'Respond to KRA letter — Odhiambo & Sons objection', assignedTo: 'Amina Waweru',
    deadline: daysAgo(3), clientId: 'c5', status: 'Pending', priority: 'High',
  },
  {
    id: 'tk3', title: 'Prepare pre-trial bundle for Hassan v. Bahari', assignedTo: 'Grace Muthoni',
    deadline: daysFromNow(5), clientId: 'c2', caseId: 'cs2', status: 'In Progress', priority: 'Medium',
  },
  {
    id: 'tk4', title: 'Draft intestate succession affidavit for Njoroge estate', assignedTo: 'David Otieno',
    deadline: daysAgo(7), clientId: 'c3', status: 'Pending', priority: 'Low',
  },
];

export const SEED_MESSAGES: Message[] = [
  {
    id: 'm1', clientId: 'c1', type: 'Call', content: 'Client called regarding upcoming hearing. Confirmed attendance and briefed on what to expect during cross-examination.',
    date: daysAgo(3), author: 'David Otieno', followUp: daysFromNow(1),
  },
  {
    id: 'm2', clientId: 'c2', type: 'Email', content: 'Sent demand letter to Bahari Supplies Ltd. Awaiting response within 7 days failing which we proceed to enforcement.',
    date: daysAgo(8), author: 'Amina Waweru', followUp: daysAgo(1),
  },
  {
    id: 'm3', clientId: 'c4', type: 'WhatsApp', content: 'Confirmed judgment date with client via WhatsApp. Client requests representation at delivery. Advised on likely outcomes.',
    date: daysAgo(1), author: 'Grace Muthoni', followUp: daysFromNow(12),
  },
];

export const SEED_LEADS: Lead[] = [
  { id: 'l1', fullName: 'Amina Wanjiku Otieno', email: 'amina@gmail.com',
    phone: '+254 712 345 678', matterSummary: 'Land dispute in Mombasa — title deed issue',
    status: 'NEW', source: 'BOOKING_FORM', county: 'Mombasa', practiceArea: 'Land Dispute',
    date: '2 Jun 2025' },
  { id: 'l2', fullName: 'Brian Kipchoge Mutai', email: 'brian@gmail.com',
    phone: '+254 723 456 789', matterSummary: 'Conveyancing — buying plot in Ruiru',
    status: 'CONTACTED', source: 'REFERRAL', county: 'Kiambu', practiceArea: 'Conveyancing',
    date: '28 May 2025' },
  { id: 'l3', fullName: 'Cynthia Achieng Odhiambo', email: 'cynthia@gmail.com',
    phone: '+254 734 567 890', matterSummary: 'Father died intestate — 3 heirs',
    status: 'QUALIFIED', source: 'BOOKING_FORM', county: 'Kisumu', practiceArea: 'Succession / Probate',
    date: '24 May 2025' },
  { id: 'l4', fullName: 'David Mwangi Kariuki', email: 'david@gmail.com',
    phone: '+254 745 678 901', matterSummary: 'Arrested — needs criminal defense representation',
    status: 'NEW', source: 'WALK_IN', county: 'Nairobi', practiceArea: 'Criminal Defense',
    date: '20 May 2025' },
  { id: 'l5', fullName: 'Esther Nduta Kamau', email: 'esther@gmail.com',
    phone: '+254 756 789 012', matterSummary: 'Divorce petition and custody dispute',
    status: 'CONVERTED', source: 'REFERRAL', county: 'Nakuru', practiceArea: 'Family Law',
    date: '10 May 2025' },
];
