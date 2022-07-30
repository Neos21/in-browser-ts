const externalBodyNow: Date = new Date();
const externalBodyText: string = 'This is external TypeScript code in "body" element.';
console.log(externalBodyNow, externalBodyText);
(async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  document.getElementById('example-external-body')?.innerText = externalBodyText;
})();
