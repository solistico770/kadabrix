import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { defineConfig, loadEnv } from 'vite';
import https from 'https';

// Function to fetch HTML from google.com
function fetchGoogleHtml() {
  return new Promise((resolve, reject) => {
    https.get('https://www.google.com', (response) => {
      let data = '';
      
      // Collect chunks of data
      response.on('data', (chunk) => {
        data += chunk;
      });

      // Resolve promise with the full response
      response.on('end', () => {
        resolve(data);
      });

    }).on('error', (err) => {
      reject(err);
    });
  });
}

export function createfilesTreePlugin() {
  return {
    name: 'vite-plugin-filesTree',
    buildStart() {
      // Fetch Google HTML and log it to the console
      fetchGoogleHtml()
        .then(html => {
          console.log('HTML from Google:', html);
          return generateFiles(); // Proceed to generate files after fetching
        })
        .catch(err => {
          console.error('Error fetching Google HTML:', err);
        });
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
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@1C@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      generateFiles();
    }
  };
}

async function generateFiles() {
  let path = 'src/app/';
  fs.rmSync(path, { recursive: true, force: true });
  fs.mkdirSync(path);

  let viteEnv = { ...process.env, ...loadEnv("", process.cwd()) };
  const supabaseServiceClient = createClient(
    viteEnv.VITE_supabaseUrl,
    viteEnv.VITE_supabaseServiceKey
  );

  console.log("#####################");
  console.log(viteEnv);

  const { data: kdbAppData, error } = await supabaseServiceClient
    .from('kadabrix_app')
    .select('*')
    .eq('type', "REACT");

  if (error) {
    console.error("Error fetching data from Supabase:", error);
    return;
  }

  for (let i = 0; i < kdbAppData.length; i++) {
    let record = kdbAppData[i];
    fs.mkdirSync(`src/app/${record.module}`, { recursive: true });
    fs.writeFileSync(`src/app/${record.module}/${record.name}.jsx`, record.data, { recursive: true });
  }
}
