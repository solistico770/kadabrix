import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export function createRoutesPlugin({ pagesDir, output }) {
  return {
    name: 'vite-plugin-routes',
    async buildStart() {
      await generateRoutes(pagesDir, output);
    }
  };
}

async function generateRoutes(pagesDir, outputFile) {
  const generateRoutesContent = (dir, basePath = '') => {
    const folders = fs.readdirSync(dir);

    return folders.reduce((routes, folder) => {
      const folderPath = path.join(dir, folder);
      const stat = fs.statSync(folderPath);

      if (stat.isDirectory()) {
        const indexPath = path.join(folderPath, 'index.jsx');
        if (fs.existsSync(indexPath)) {
          // Construct route path based on directory structure
          const routePath = path.join(basePath, folder).replace(/\\/g, '/');
          routes.push({
            path: `/${routePath}`,
            component: `./pages/${path.relative(pagesDir, indexPath).replace(/\\/g, '/')}`,
            importName: routePath
              .split('/')
              .map(part => part.charAt(0).toUpperCase() + part.slice(1))
              .join('') + 'Index',
          });
        }

        // Recurse into subdirectories
        routes.push(...generateRoutesContent(folderPath, path.join(basePath, folder)));
      }

      return routes;
    }, []);
  };

  const routes = generateRoutesContent(pagesDir);

  const outputContent = `
  import React from 'react';
  import { Routes, Route } from 'react-router-dom';

  ${routes.map(route => `import ${route.importName} from '${route.component}';`).join('\n')}

  const AppRoutes = () => (
    <Routes>
      ${routes.map(route => `<Route path="${route.path}" element={<${route.importName} />} />`).join('\n      ')}
    </Routes>
  );

  export default AppRoutes;
  `;

  fs.writeFileSync(outputFile, outputContent, 'utf8');
  console.log('Routes generated successfully...', outputFile);
}
