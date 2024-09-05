import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { defineConfig, loadEnv } from 'vite';
import https from 'https';

export function createfilesTreePlugin() {
  return {
    name: 'vite-plugin-filesTree',
   async  buildStart() {
      
      await generateFiles()

      
    },
    handleHotUpdate({ file }) {
      //generateFiles();
    },
    configureServer(server) {
      server.watcher.on('add', file => {
        //generateFiles();
      });
      server.watcher.on('unlink', file => {
        //generateFiles();
      });
    },
    buildEnd() {
    }
  };
}

async function generateFiles() {
  
  let path = 'src/app/';
  fs.rmSync(path, { recursive: true, force: true });
  fs.mkdirSync(path);

  let viteEnv = { ...process.env, ...loadEnv("", process.cwd()) };
  
  try {
    const response = await fetch(viteEnv.VITE_supabaseUrl+"/functions/v1/runkdb", {
      headers: {
        "authorization": "Bearer "+viteEnv.VITE_supabaseKey
      },
      body: JSON.stringify({
        module: "frontendGate",
        name: "getReact",
        data: {}
      }),
      method: "POST"
    });
  
    // Check if the response is okay (status code 2xx)
    if (response.ok) {
      const {data:kdbAppData} = await response.json();

  
      for (let i = 0; i < kdbAppData.length; i++) {
        let record = kdbAppData[i];
        fs.mkdirSync(`src/app/${record.module}`, { recursive: true });
        fs.writeFileSync(`src/app/${record.module}/${record.name}.jsx`, record.data, { recursive: true });
      }


      
    } else {
      console.error("Error:", response.status, response.statusText);  // Handle non-2xx responses
    }
  } catch (error) {
    console.error("Fetch error:", error);  // Handle network errors
  }

  

}
