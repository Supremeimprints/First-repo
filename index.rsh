'reach 0.1';

const COUNT_DOWN = 10;

const Common = 
{
  showTime: Fun([UInt], Null),
}
export const main = Reach.App(() => {
  const A = Participant('Alice', 
  {
    ...Common,
    inheritance: UInt,
    here: Fun([], Bool),
  });
  const B = Participant('Bob', 
  {
    ...Common,
    acceptTerms: Fun([UInt],Bool),
  });
  init();

  A.only(() => 
  {
    const value = declassify(interact.inheritance);
  })
  A.publish(value)
    .pay(value);
  commit();

  B.only(() => 
  {
    const decision = declassify(interact.acceptTerms(value));
  })
  B.publish(decision);
  commit();

  each([A,B], () => 
  {
    interact.showTime(COUNT_DOWN);
  });

  A.only(() => 
  {
    const stillHere = declassify(interact.here());
  })
  A.publish(stillHere);

  if(!stillHere)
  {
    transfer(value).to(B);
  } 
  
  transfer(balance()).to(A);
  commit();
  exit();
});
