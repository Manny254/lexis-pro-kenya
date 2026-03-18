import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Client, Case, Hearing, Document, Invoice, TimeEntry, Task, Message } from '@/types';
import {
  SEED_CLIENTS, SEED_CASES, SEED_HEARINGS, SEED_DOCUMENTS,
  SEED_INVOICES, SEED_TIME_ENTRIES, SEED_TASKS, SEED_MESSAGES,
} from '@/data/seed';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  undoFn?: () => void;
}

interface AppContextType {
  clients: Client[];
  cases: Case[];
  hearings: Hearing[];
  documents: Document[];
  invoices: Invoice[];
  timeEntries: TimeEntry[];
  tasks: Task[];
  messages: Message[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  setCases: React.Dispatch<React.SetStateAction<Case[]>>;
  setHearings: React.Dispatch<React.SetStateAction<Hearing[]>>;
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  setTimeEntries: React.Dispatch<React.SetStateAction<TimeEntry[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  toasts: Toast[];
  addToast: (msg: string, type: Toast['type'], undoFn?: () => void) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(SEED_CLIENTS);
  const [cases, setCases] = useState<Case[]>(SEED_CASES);
  const [hearings, setHearings] = useState<Hearing[]>(SEED_HEARINGS);
  const [documents, setDocuments] = useState<Document[]>(SEED_DOCUMENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(SEED_INVOICES);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(SEED_TIME_ENTRIES);
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((msg: string, type: Toast['type'], undoFn?: () => void) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message: msg, type, undoFn }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      clients, cases, hearings, documents, invoices, timeEntries, tasks, messages,
      setClients, setCases, setHearings, setDocuments, setInvoices, setTimeEntries, setTasks, setMessages,
      toasts, addToast, removeToast,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
