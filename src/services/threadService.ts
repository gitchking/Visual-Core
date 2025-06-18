import { supabase } from '@/lib/supabase';

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
    
    if (!supabase) {
      console.log('Using local storage fallback for threads');
      const threads = localStorageThreads.getAllThreads();
      console.log('Retrieved threads from local storage:', threads);
      return threads;
    }
    
    try {
      const { data, error } = await supabase
        .from('threads')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching threads:', error);
        throw error;
      }
      
      console.log('Retrieved threads from Supabase:', data);
      return data || [];
    } catch (error) {
      console.error('Supabase error, falling back to local storage:', error);
      const threads = localStorageThreads.getAllThreads();
      console.log('Retrieved threads from local storage fallback:', threads);
      return threads;
    }
  },

  async createThread(thread: { title: string; content: string; tags?: string; websiteUrl?: string }) {
    console.log('Creating thread:', thread);
    
    if (!supabase) {
      console.log('Using local storage fallback for thread creation');
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
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('threads')
        .insert({
          user_id: user.id,
          title: thread.title,
          content: thread.content,
          tags: thread.tags || '',
          website_url: thread.websiteUrl || '',
          upvotes: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating thread:', error);
        throw error;
      }

      console.log('Thread created in Supabase:', data);
      return data;
    } catch (error) {
      console.error('Supabase error, falling back to local storage:', error);
      const newThread = localStorageThreads.addThread({
        user_id: 'local_user',
        title: thread.title,
        content: thread.content,
        tags: thread.tags || '',
        website_url: thread.websiteUrl || '',
        username: 'Local User',
        full_name: 'Local User'
      });
      console.log('Thread created in local storage fallback:', newThread);
      return newThread;
    }
  },

  async upvoteThread(id: number) {
    console.log('Upvoting thread:', id);
    
    if (!supabase) {
      console.log('Using local storage fallback for upvote');
      const updatedThread = localStorageThreads.updateThread(id, {
        upvotes: (localStorageThreads.getAllThreads().find(t => t.id === id)?.upvotes || 0) + 1
      });
      console.log('Thread upvoted in local storage:', updatedThread);
      return updatedThread;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // First, get the current thread to check if user already upvoted
      const { data: thread } = await supabase
        .from('threads')
        .select('upvotes')
        .eq('id', id)
        .single();

      if (!thread) {
        throw new Error('Thread not found');
      }

      // Update the upvotes count
      const { error } = await supabase
        .from('threads')
        .update({ upvotes: (thread.upvotes || 0) + 1 })
        .eq('id', id);

      if (error) {
        console.error('Error upvoting thread:', error);
        throw error;
      }
    } catch (error) {
      console.error('Supabase error, falling back to local storage:', error);
      const updatedThread = localStorageThreads.updateThread(id, {
        upvotes: (localStorageThreads.getAllThreads().find(t => t.id === id)?.upvotes || 0) + 1
      });
      console.log('Thread upvoted in local storage fallback:', updatedThread);
      return updatedThread;
    }
  },

  async getThreadById(id: number) {
    if (!supabase) {
      const threads = localStorageThreads.getAllThreads();
      const thread = threads.find(t => t.id === id);
      return thread || null;
    }

    try {
      const { data, error } = await supabase
        .from('threads')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching thread:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Supabase error, falling back to local storage:', error);
      const threads = localStorageThreads.getAllThreads();
      const thread = threads.find(t => t.id === id);
      return thread || null;
    }
  },

  async getUserThreads(userId: string) {
    if (!supabase) {
      const threads = localStorageThreads.getAllThreads();
      return threads.filter(t => t.user_id === userId);
    }

    try {
      const { data, error } = await supabase
        .from('threads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user threads:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Supabase error, falling back to local storage:', error);
      const threads = localStorageThreads.getAllThreads();
      return threads.filter(t => t.user_id === userId);
    }
  }
};
