/*! in-browser-ts : https://neos21.net/ */
(() => {
  const isOutputLog = typeof window.inBrowserTsIsOutputLog !== 'undefined';
  
  if(typeof document === 'undefined') {
    if(isOutputLog) console.error(new Date().toISOString(), 'In Browser TS : document Does Not Exist. Abort');
    return;
  }
  
  const inBrowserTs = async () => {
    if(isOutputLog) console.log(new Date().toISOString(), 'In Browser TS : Start');
    
    const tsElements = [...document.querySelectorAll('script[type="text/typescript"]')];
    if(!tsElements.length) {
      if(isOutputLog) console.log(new Date().toISOString(), 'In Browser TS : TS Elements Not Found. Nothing To Do');
      return;
    }
    if(isOutputLog) console.log(new Date().toISOString(), `TS Elements Length : [${tsElements.length}]`);
    
    // Get TypeScript Sources
    const tsSources = await Promise.all(tsElements.map((tsElement, index) => {
      // External Script
      if(tsElement.src) return new Promise(resolve => {
        if(isOutputLog) console.log(new Date().toISOString(), `  [${index}] External Script`);
        const xhr = new XMLHttpRequest();
        xhr.open('GET', tsElement.src, true /* Async */);
        xhr.onload = () => {
          if(xhr.status !== 200) {
            if(isOutputLog) console.error(new Date().toISOString(), `  [${index}] Internal Script : XHR Loaded But Error`, xhr, xhr.status, xhr.responseText, tsElements[index]);
            return resolve('');
          }
          
          if(isOutputLog) console.log(new Date().toISOString(), `  [${index}] Internal Script : XHR Loaded`, xhr);
          resolve(xhr.responseText);
        };
        xhr.ontimeout = event => {
          if(isOutputLog) console.error(new Date().toISOString(), `  [${index}] Internal Script : XHR Timeout`, xhr, event, tsElements[index]);
          resolve('');
        };
        xhr.timeout = 5000 /* ms */;
        xhr.send();
      });
      
      // Internal Script
      if(isOutputLog) console.log(new Date().toISOString(), `  [${index}] Internal Script`);
      return Promise.resolve(tsElement.innerHTML);
    }));
    
    // Compile And Insert
    tsSources.forEach((tsSource, index) => {
      try {
        if(tsSource.trim() === '') {
          if(isOutputLog) console.warn(new Date().toISOString(), `  <${index}> Empty`, tsElements[index], tsSource);
          return;
        }
        
        const jsSource = window.ts.transpile(tsSource);
        const jsElement = document.createElement('script');
        jsElement.type = 'text/javascript';
        jsElement.innerHTML = jsSource;
        document.body.appendChild(jsElement);
        if(isOutputLog) console.log(new Date().toISOString(), `  <${index}> Append`);
      }
      catch(error) {
        if(isOutputLog) console.error(new Date().toISOString(), `  <${index}> Error : Failed To Append`, error, tsElements[index], tsSource);
      }
    });
    
    if(isOutputLog) console.log(new Date().toISOString(), 'In Browser TS : Finished');
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    if(typeof window.ts === 'undefined') {
      if(isOutputLog) console.log(new Date().toISOString(), 'In Browser TS : window.ts Does Not Exist. Load From CDN...');
      const tsElement = document.createElement('script');
      tsElement.type = 'text/javascript';
      tsElement.src = 'https://cdnjs.cloudflare.com/ajax/libs/typescript/4.7.4/typescript.min.js';
      tsElement.onload = () => {
        if(isOutputLog) console.log(new Date().toISOString(), 'In Browser TS : typescript.js Loaded. Exec In Browser TS');
        inBrowserTs();
      };
      tsElement.onerror = () => {
        if(isOutputLog) console.error(new Date().toISOString(), 'Error : Failed To Load typescript.js. Abort');
      };
      document.head.appendChild(tsElement);
    }
    else {
      if(isOutputLog) console.log(new Date().toISOString(), 'In Browser TS : window.ts Is Already Exist. Exec In Browser TS');
      inBrowserTs();
    }
  });
})();
