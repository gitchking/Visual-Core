// Local storage fallback for threads
const localStorageThreads = {
  getAllThreads: () => {
    const threadsStr = localStorage.getItem('localThreads');
    return threadsStr ? JSON.parse(threadsStr) : [];
  },
  
  saveThreads: (threads: any[]) => {
    localStorage.setItem('localThreads', JSON.stringify(threads));
  },
  
  addThread: (thread: any) => {
    const threads = localStorageThreads.getAllThreads();
    const newThread = {
      ...thread,
      id: Date.now(),
      created_at: new Date().toISOString(),
      upvotes: 0
    };
    threads.unshift(newThread);
    localStorageThreads.saveThreads(threads);
    return newThread;
  },
  
  updateThread: (id: number, updates: any) => {
    const threads = localStorageThreads.getAllThreads();
    const index = threads.findIndex(t => t.id === id);
    if (index !== -1) {
      threads[index] = { ...threads[index], ...updates };
      localStorageThreads.saveThreads(threads);
      return threads[index];
    }
    return null;
  }
};

export const threadService = {
  async getAllThreads() {
    console.log('Getting all threads...');
    
    const threads = localStorageThreads.getAllThreads();
    console.log('Retrieved threads from local storage:', threads);
    return threads;
  },

  async createThread(thread: { title: string; content: string; tags?: string; websiteUrl?: string }) {
    console.log('Creating thread:', thread);
    
    const newThread = localStorageThreads.addThread({
      user_id: 'local_user',
      title: thread.title,
      content: thread.content,
      tags: thread.tags || '',
      website_url: thread.websiteUrl || '',
      username: 'Local User',
      full_name: 'Local User'
    });
    console.log('Thread created in local storage:', newThread);
    return newThread;
  },

  async upvoteThread(id: number) {
    console.log('Upvoting thread:', id);
    
    const updatedThread = localStorageThreads.updateThread(id, {
      upvotes: (localStorageThreads.getAllThreads().find(t => t.id === id)?.upvotes || 0) + 1
    });
    console.log('Thread upvoted in local storage:', updatedThread);
    return updatedThread;
  },

  async getThreadById(id: number) {
    const threads = localStorageThreads.getAllThreads();
    const thread = threads.find(t => t.id === id);
    return thread || null;
  },

  async getUserThreads(userId: string) {
    const threads = localStorageThreads.getAllThreads();
    return threads.filter(t => t.user_id === userId);
  }
};
