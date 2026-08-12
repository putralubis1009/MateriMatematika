import { createClient } from "@insforge/sdk";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient({
  baseUrl: supabaseUrl,
  anonKey: supabaseKey,
});

async function main() {
  console.log("Testing database connection...");
  
  // Try to login with a test user or just see if the table exists
  const { data, error } = await supabase.database.from("murid").select("*").limit(1);
  
  if (error) {
    console.error("Error selecting from murid:", error);
  } else {
    console.log("Success! Data:", data);
  }
}

main().catch(console.error);
