// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hpnoobzjikxcnkuuzlqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwbm9vYnpqaWt4Y25rdXV6bHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MjYxOTIsImV4cCI6MjA2NjAwMjE5Mn0.UAbNUXbVFi3FeD4ZCev_ThDTE1Pn3o9RTeR6H3_9YjE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);