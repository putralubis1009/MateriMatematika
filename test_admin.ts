require("dotenv").config({ path: ".env.local" }); // Will load if exists
require("dotenv").config(); // Load standard .env if exists

const { createAdminClient } = require("./lib/db.server.ts");

async function run() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.database
      .from("murid")
      .select("*")
      .eq("kode_akses", "8E88-596F")
      .single();
      
    console.log("Data:", data);
    console.log("Error:", error);
  } catch (e) {
    console.log("Exception:", e);
  }
}

run();
