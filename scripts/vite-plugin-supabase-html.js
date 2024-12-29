import { loadEnv } from 'vite';
import fs from 'fs';
import path from 'path';

export function createSupabaseConfig() {
  return {
    name: 'vite-plugin-supabase-config',

    configResolved(config) {
      // Store the mode and root directory
     
    },

    writeBundle() {
      
      let viteEnv  = {...process.env, ...loadEnv( "" , process.cwd())};
      console.log("Generating config.js with Supabase credentials");
      console.log(`Supabase URL: ${viteEnv.VITE_supabaseUrl}`);
      console.log(`Supabase Key: ${viteEnv.VITE_supabaseKey}`);

      // Prepare the content for config.js
      const fileContent = `
        {
          "supabaseUrl": "${viteEnv.VITE_supabaseUrl}",
          "supabaseKey": "${viteEnv.VITE_supabaseKey}"
        }
      `;

      // Write the file to the dist directory
      const outputPath = 'dist/config.js'
      fs.writeFileSync(outputPath, fileContent, 'utf-8');

      console.log(`Supabase config written to ${outputPath}`);
    },
  };
}
