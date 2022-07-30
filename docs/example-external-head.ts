const externalHeadNow: Date = new Date();
const externalHeadText: string = 'This is external TypeScript code in "head" element.';
console.log(externalHeadNow, externalHeadText);
document.getElementById('example-external-head')?.innerText = externalHeadText;
