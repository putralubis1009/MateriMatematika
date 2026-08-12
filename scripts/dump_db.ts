import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: murid } = await supabase.from('murid').select('*');
  console.log('MURID:', murid);

  const { data: tugas } = await supabase.from('tugas').select('*');
  console.log('TUGAS:', tugas);
}
main().catch(console.error);
