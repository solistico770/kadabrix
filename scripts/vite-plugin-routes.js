import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js'
import { defineConfig, loadEnv } from 'vite';

export  function createRoutesPlugin({ pagesDir, output }) {
  return {
    name: 'vite-plugin-routes',
    async buildStart() {
      
      await generateRoutes(pagesDir, output);

      
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



    try {

      const response = await fetch(viteEnv.VITE_supabaseUrl+"/functions/v1/runkdb", {
        headers: {
          "authorization": "Bearer "+viteEnv.VITE_supabaseKey
        },
        body: JSON.stringify({
          module: "frontendGate",
          name: "getRoutes",
          data: {}
        }),
        method: "POST"
      });

      // Check if the response is okay (status code 2xx)
      if (response.ok) {
      const {data:kdbAppData} = await response.json();

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
  
      } else {
        console.error("Error:", response.status, response.statusText);  // Handle non-2xx responses
      }
    } catch (error) {
      console.error("Fetch error:", error);  // Handle network errors
    }

    
  }
  
  
    
  let droutes = await generateRoutesContentDynamic()
  const routes = [...droutes , ...generateRoutesContent(pagesDir)]
  



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
  console.log('Routes generated successfully...',outputFile);
}
