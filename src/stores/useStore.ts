
import { create } from 'zustand';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

interface Thread {
  id: number;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  created_at: string;
}

interface Flow {
  id: number;
  name: string;
  flow_data: any;
  created_at: string;
}

interface AppState {
  todos: Todo[];
  threads: Thread[];
  flows: Flow[];
  currentUser: { id: number; username: string; email: string } | null;
  
  // Actions
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Omit<Todo, 'id' | 'created_at'>) => void;
  updateTodo: (id: number, updates: Partial<Todo>) => void;
  deleteTodo: (id: number) => void;
  
  setThreads: (threads: Thread[]) => void;
  addThread: (thread: Omit<Thread, 'id' | 'created_at'>) => void;
  
  setFlows: (flows: Flow[]) => void;
  saveFlow: (flow: Omit<Flow, 'id' | 'created_at'>) => void;
  
  setCurrentUser: (user: { id: number; username: string; email: string } | null) => void;
}

export const useStore = create<AppState>((set, get) => ({
  todos: [],
  threads: [],
  flows: [],
  currentUser: null,

  setTodos: (todos) => set({ todos }),
  addTodo: (todo) => {
    const newTodo = {
      ...todo,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    set((state) => ({ todos: [...state.todos, newTodo] }));
  },
  updateTodo: (id, updates) => {
    set((state) => ({
      todos: state.todos.map(todo => 
        todo.id === id ? { ...todo, ...updates } : todo
      )
    }));
  },
  deleteTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter(todo => todo.id !== id)
    }));
  },

  setThreads: (threads) => set({ threads }),
  addThread: (thread) => {
    const newThread = {
      ...thread,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    set((state) => ({ threads: [...state.threads, newThread] }));
  },

  setFlows: (flows) => set({ flows }),
  saveFlow: (flow) => {
    const newFlow = {
      ...flow,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    set((state) => ({ flows: [...state.flows, newFlow] }));
  },

  setCurrentUser: (user) => set({ currentUser: user }),
}));
