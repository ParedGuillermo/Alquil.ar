import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sfuosvcyjcagmhmtlsxi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmdW9zdmN5amNhZ21obXRsc3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MzgxMjcsImV4cCI6MjA2ODExNDEyN30.kjVanremdvwJrbu6skpFAtCi_84r4myxtw4wu01ClnU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
