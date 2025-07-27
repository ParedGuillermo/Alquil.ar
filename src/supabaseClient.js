// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zcoekpdxfbnooopsrrec.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjb2VrcGR4ZmJub29vcHNycmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3Njc5MTQsImV4cCI6MjA2NzM0MzkxNH0.8UgV94AW1qep1u__RtWSPJnenmXL2JJ92wJuXQJETVs';

export const supabase = createClient(supabaseUrl, supabaseKey);
