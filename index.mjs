import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(6000)


const accAlice = await stdlib.newTestAccount(startingBalance);
const accBob = await stdlib.newTestAccount(stdlib.parseCurrency(100));
console.log('Hello Alice and Bob!');

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

const getBalance = async (who) =>  stdlib.formatCurrency(await stdlib.balanceOf(who));

console.log(`Alice's balance is: ${ await getBalance(accAlice) }`);
console.log(`Bob's balance is: ${ await getBalance(accBob) }`);

const choiceArray = ["I'm not here","I'm still here"];

const Common = 
{
  showTime: (time) => {
    console.log(`Remaining Time is ${parseInt(time)}`);
  }
}

console.log('Starting backends...');
await Promise.all([
  backend.Alice(ctcAlice, 
  {
    ...Common,
    inheritance: stdlib.parseCurrency(5000),
    here: () => 
    {
      const choice = Math.floor(Math.random() * 2);
      console.log(`Alice's choice is ${ choiceArray[choice] }`);
      return (choice == 0 ? false : true);
    },
    
  }),
  backend.Bob(ctcBob, 
  {
    ...Common,
    acceptTerms: (amt) => 
    {
      console.log(`Bob accepts the terms for ${ stdlib.formatCurrency(amt) } from Alice`)
      return  true;
    }
  }),
]);

console.log(`Alice's balance is: ${await getBalance(accAlice)}`);
console.log(`Bob's balance is: ${await getBalance(accBob)}`);
console.log('Goodbye, Alice and Bob!');