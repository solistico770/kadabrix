import fs from 'fs';
import { createClient } from '@supabase/supabase-js'
import { defineConfig, loadEnv } from 'vite';


export function createfilesTreePlugin() {
  return {
    name: 'vite-plugin-filesTree',
    buildStart() {
     

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
let path='src/app/';
fs.rmSync(path, { recursive: true, force: true });
fs.mkdirSync(path);


let viteEnv  = {...process.env, ...loadEnv( "" , process.cwd())};
const supabaseServiceClient = createClient(
  viteEnv.VITE_supabaseUrl,
  viteEnv.VITE_supabaseServiceKey
)

console.log("#####################");
console.log(viteEnv);


const { data: kdbAppData, error } = await supabaseServiceClient
.from('kadabrix_app')
.select('*')
.eq('type', "REACT");

console.log(kdbAppData);

for (let i=0;i<kdbAppData.length;i++){
  let record = kdbAppData[i];
  
  fs.mkdirSync(`src/app/${record.module}`,{ recursive: true });
  fs.writeFileSync(`src/app/${record.module}/${record.name}.jsx`,record.data,{ recursive: true });
}



}
