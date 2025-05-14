import fs from 'fs';

const array1: string[] = JSON.parse(
  fs.readFileSync('players_temp.json', 'utf-8')
);
const array2: string[] = JSON.parse(fs.readFileSync('players.json', 'utf-8'));

const onlyInArray1 = array1.filter((item) => !array2.includes(item));
const onlyInArray2 = array2.filter((item) => !array1.includes(item));

console.log('Only in array1:', onlyInArray1);
console.log('Only in array2:', onlyInArray2);
