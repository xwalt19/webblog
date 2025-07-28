import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yetolxphmbvnlwxtoitt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlldG9seHBobWJ2bmx3eHRvaXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2Nzg2NzEsImV4cCI6MjA2OTI1NDY3MX0.-heyCdVViGOir98EVmr08518uMUX5qvS4lQrmaRSXcc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);