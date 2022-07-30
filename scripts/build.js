// Build For Dist And GitHub Pages
// ================================================================================

const fs       = require('fs');
const path     = require('path');
const uglifyJs = require('uglify-js');


// File Paths
// ================================================================================

const pathInBrowserTs = path.resolve(__dirname, '../src/in-browser-ts.js');
const pathLibTs       = path.resolve(__dirname, '../lib/typescript.4.7.4.js');
const pathLibTsMin    = path.resolve(__dirname, '../lib/typescript.4.7.4.min.js');


// Tasks
// ================================================================================

const remakeDirectory = directoryPath => {
  if(fs.existsSync(directoryPath)) fs.rmdirSync(directoryPath, { recursive: true });
  fs.mkdirSync(directoryPath);
};

const copyAssets = () => {
  // Dist
  fs.copyFileSync(pathInBrowserTs                                      , path.resolve(__dirname, '../dist/in-browser-ts.js'   ));
  fs.copyFileSync(pathLibTs                                            , path.resolve(__dirname, '../dist/typescript.js'      ));
  fs.copyFileSync(pathLibTsMin                                         , path.resolve(__dirname, '../dist/typescript.min.js'  ));
  // Docs
  fs.copyFileSync(pathInBrowserTs                                      , path.resolve(__dirname, '../docs/in-browser-ts.js' ));
  fs.copyFileSync(pathLibTs                                            , path.resolve(__dirname, '../docs/typescript.js'    ));
  fs.copyFileSync(pathLibTsMin                                         , path.resolve(__dirname, '../docs/typescript.min.js'));
  fs.copyFileSync(path.resolve(__dirname, './example-external-head.ts'), path.resolve(__dirname, '../docs/example-external-head.ts'));
  fs.copyFileSync(path.resolve(__dirname, './example-external-body.ts'), path.resolve(__dirname, '../docs/example-external-body.ts'));
};

const minify = srcInBrowserTs => uglifyJs.minify(srcInBrowserTs, {
  compress: true,
  mangle: true,
  output: { comments: (/^!/) }
}).code + '\n';

const buildSeparation = minInBrowserTs => {
  const distPath = path.resolve(__dirname, '../dist/in-browser-ts.min.js');
  fs.writeFileSync(distPath, minInBrowserTs, 'utf-8');
  fs.copyFileSync(distPath, path.resolve(__dirname, '../docs/in-browser-ts.min.js'));
};

const buildBundle = (srcInBrowserTs, minInBrowserTs) => {
  // Src Bundle
  const srcLibTs = fs.readFileSync(pathLibTs, 'utf-8');
  const pathDistBundle = path.resolve(__dirname, '../dist/in-browser-ts.bundle.js');
  fs.writeFileSync(pathDistBundle, srcLibTs + srcInBrowserTs, 'utf-8');
  fs.copyFileSync(pathDistBundle, path.resolve(__dirname, '../docs/in-browser-ts.bundle.js'));
  
  // Min Bundle
  const srcLibTsMin = fs.readFileSync(pathLibTsMin, 'utf-8');
  const pathDistBundleMin = path.resolve(__dirname, '../dist/in-browser-ts.bundle.min.js');
  fs.writeFileSync(pathDistBundleMin, srcLibTsMin + minInBrowserTs, 'utf-8');
  fs.copyFileSync(pathDistBundleMin, path.resolve(__dirname, '../docs/in-browser-ts.bundle.min.js'));
};

const buildHtml = () => {
  const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8');
  const targetLine = '<!-- INSERT HERE -->';
  
  // Src Separated
  const srcSeparated = html.replace(targetLine, '    <!-- Load TypeScript JS -->\n    <script src="./typescript.js"></script>\n    \n    <!-- Load In Browser TS -->\n    <script src="./in-browser-ts.js"></script>');
  fs.writeFileSync(path.resolve(__dirname, '../docs/index.html'), srcSeparated, 'utf-8');
  // Min Separated
  const minSeparated = html.replace(targetLine, '    <!-- Load TypeScript JS (Min) -->\n    <script src="./typescript.min.js"></script>\n    \n    <!-- Load In Browser TS (Min) -->\n    <script src="./in-browser-ts.min.js"></script>');
  fs.writeFileSync(path.resolve(__dirname, '../docs/test-min-separated.html'), minSeparated, 'utf-8');
  
  // Src Bundle
  const srcBundle = html.replace(targetLine, '    <!-- Load In Browser TS (Bundle) -->\n    <script src="./in-browser-ts.bundle.js"></script>');
  fs.writeFileSync(path.resolve(__dirname, '../docs/test-src-bundle.html'), srcBundle, 'utf-8');
  // Min Bundle
  const minBundle = html.replace(targetLine, '    <!-- Load In Browser TS (Min Bundle) -->\n    <script src="./in-browser-ts.bundle.min.js"></script>');
  fs.writeFileSync(path.resolve(__dirname, '../docs/test-min-bundle.html'), minBundle, 'utf-8');
};


// Main
// ================================================================================

(() => { 
  console.log(new Date().toISOString(), 'Build Start');

  // ディレクトリを再作成する
  remakeDirectory(path.resolve(__dirname, '../dist'));
  remakeDirectory(path.resolve(__dirname, '../docs'));
  
  // ファイルコピーだけで済むモノ達
  copyAssets();
  
  // JS ファイルを用意する
  const srcInBrowserTs = fs.readFileSync(pathInBrowserTs, 'utf-8');
  const minInBrowserTs = minify(srcInBrowserTs);
  buildSeparation(minInBrowserTs);
  buildBundle(srcInBrowserTs, minInBrowserTs);
  
  // HTML を用意する
  buildHtml();
  
  console.log(new Date().toISOString(), 'Build Finished');
})();
