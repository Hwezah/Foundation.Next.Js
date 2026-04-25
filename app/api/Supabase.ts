import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://gaojwilavmullvnglpwp.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlbHBxdWFuaHR2bnpoaHB3ZXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNjUzOTcsImV4cCI6MjA2MTg0MTM5N30.7AXSqNJ_h7JuNDMtMXinsIR2CTpoBXwnTJack-KTFus";
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
