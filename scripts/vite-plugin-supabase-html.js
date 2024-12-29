import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js'
import { defineConfig, loadEnv } from 'vite';

export  function createSupabaseConfig() {
  return {
    name: 'vite-plugin-supabase-config',
    async generateBundle() {
      console.log(`Supabase config emitted as config.js`);

      await genFile();

      
    }
  };
}

async function genFile() {
  let viteEnv  = {...process.env, ...loadEnv( "" , process.cwd())};

  console.log("Generating file");
console.log(viteEnv.VITE_supabaseUrl);

const fileContent = `{
  "supabaseUrl": "${viteEnv.VITE_supabaseUrl}",
  "supabaseKey": "${viteEnv.VITE_supabaseKey}"
}`


      // Emit config.js as an asset
      this.emitFile({
        type: 'asset',
        fileName: 'config.js',
        source: fileContent,
      });

      console.log(`Supabase config emitted as config.js`);




}


