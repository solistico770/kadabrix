import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js'
import { defineConfig, loadEnv } from 'vite';

export  function createSupabaseConfig() {
  return {
    name: 'vite-plugin-supabase-config',
    async buildStart() {
      
      await genFile();

      
    }
  };
}

async function genFile() {
  let viteEnv  = {...process.env, ...loadEnv( "" , process.cwd())};

  console.log("Generating file");
console.log(viteEnv.VITE_supabaseUrl);

let file = `{
  "supabaseUrl": "${viteEnv.VITE_supabaseUrl}",
  "supabaseKey": "${viteEnv.VITE_supabaseKey}"
}`

fs.writeFileSync(path.resolve(__dirname, '../public/supabaseConfig.json'), file);


}
