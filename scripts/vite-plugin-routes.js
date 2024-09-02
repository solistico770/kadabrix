import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js'
import { defineConfig, loadEnv } from 'vite';

export  function createRoutesPlugin({ pagesDir, output }) {
  return {
    name: 'vite-plugin-routes',
    buildStart() {
      
      this.addWatchFile(pagesDir);
    },
    handleHotUpdate({ file }) {
      if (file.startsWith(pagesDir)) {
      //  generateRoutes(pagesDir, output);
      }
    },
    configureServer(server) {
      server.watcher.on('add', file => {
        if (file.startsWith(pagesDir)) {
      //    generateRoutes(pagesDir, output);
        }
      });
      server.watcher.on('unlink', file => {
        if (file.startsWith(pagesDir)) {
         // generateRoutes(pagesDir, output);
        }
      });
    },
    buildEnd() {
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@1R@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      generateRoutes(pagesDir, output);
    }
  };
}

async function generateRoutes(pagesDir, outputFile) {
  const generateRoutesContent = (dir) => {
    const folders = fs.readdirSync(dir);

    return folders.reduce((routes, folder) => {
      const folderPath = path.join(dir, folder);
      const stat = fs.statSync(folderPath);

      if (stat.isDirectory()) {
        const indexPath = path.join(folderPath, 'index.jsx');
        if (fs.existsSync(indexPath)) {
          routes.push({
            path: `/${folder}`,
            component: `./pages/${folder}/index.jsx`,
            importName: folder.charAt(0).toUpperCase() + folder.slice(1) + 'Index',
          });
        }
      }

      return routes;
    }, []);
  };


  
  async function generateRoutesContentDynamic() {
    let path='./app/';
    let viteEnv  = {...process.env, ...loadEnv( "" , process.cwd())};
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    
    console.log(viteEnv);
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    const supabaseServiceClient = createClient(
      viteEnv.VITE_supabaseUrl,
      viteEnv.VITE_supabaseServiceKey
    )
    
    const { data: kdbAppData, error } = await supabaseServiceClient
    .from('kadabrix_app')
    .select('*')
    .eq('type', "ROUTE");
    console.log(kdbAppData, error);
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    
    let routes=[]
    for (let i=0;i<kdbAppData.length;i++){
      let record = kdbAppData[i];
      
      routes.push({
        path: `${record.data}`,
        component: `./app/${record.module}/Main.jsx`,
        importName: "C"+record.data + 'Index',
      });
  
  
    }
    
    return routes;
  
    
    }
  
  
    
  let droutes = await generateRoutesContentDynamic()
  const routes = [...droutes , ...generateRoutesContent(pagesDir)]
  //const routes = [...generateRoutesContent(pagesDir)]



  const outputContent = `
  import React from 'react';
  import { Routes, Route } from 'react-router-dom';

  ${routes.map(route => `import ${route.importName} from '${route.component}';`).join('\n')}

  const AppRoutes = () => (
    <Routes>
      <Route path="/" element={<LoginIndex />} />
      ${routes.map(route => `<Route path="${route.path}" element={<${route.importName} />} />`).join('\n')}
    </Routes>
  );

  export default AppRoutes;
  `;

  fs.writeFileSync(outputFile, outputContent, 'utf8');
  console.log('Routes generated successfully.');
}
