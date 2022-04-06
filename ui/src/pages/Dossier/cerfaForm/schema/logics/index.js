import { siretLogics } from "./siretLogics";
import { idccLogics } from "./idccLogics";
import { apprentiMineurLogics } from "./apprentiMineurLogics";
import { RemunerationsLogics } from "./remunerationsLogics";
import { ContratDatesLogics } from "./ContratDatesLogics";
import { ageApprentLogics } from "./ageApprentLogics";

export const logics = [
  ...idccLogics,
  ...siretLogics,
  ...ageApprentLogics,
  ...ContratDatesLogics,
  ...apprentiMineurLogics,
  ...RemunerationsLogics,
];

console.log("oo");

export const dependences = (() => {
  const names = {};
  logics.forEach((rule) => {
    rule.deps.forEach((dep) => {
      rule.deps.forEach((depI) => {
        names[dep] = names[dep] ?? {};
        names[dep][depI] = true;
      });
      delete names[dep][dep];
    });
  });
  return Object.fromEntries(Object.keys(names).reduce((acc, name) => [...acc, [name, Object.keys(names[name])]], []));
})();
