import KnapsackProblem from './knapsackProblem.mjs';
import * as fs from 'fs';

const data = fs.readFileSync('objects/objects.json');
const object = JSON.parse(data);

const VERIFY = 10;
const NB_POPULATION = 500;
const BEST_SELECTED = 10;
const SACK_CAPACITY = 10;

const sac = new KnapsackProblem(SACK_CAPACITY, object);
const generation = [];
let cpt = 0;
let index = 0;

let population = sac.generatePopulation(NB_POPULATION);
let BEST = {
    value: 0,
    weight: 0,
    individual: ""
}

while (cpt < VERIFY) {
    let filteredPopulation = sac.filterPopulation(population);
    generation.push(filteredPopulation.result);
    const childFitness = sac.fitness(generation[index][0], 0);
    console.log(`-------------------generation ${index} ---------------`);
    console.log(generation[index]);
    if (childFitness.value >= BEST.value && childFitness.weight <= SACK_CAPACITY) {
        BEST.value = childFitness.value;
        BEST.weight = childFitness.weight;
        BEST.individual = generation[index][0];
        cpt++;
        index++;
    } else {
        cpt = 0;
        index++;
    }
    population = sac.generateNewPopulation(NB_POPULATION, generation[index - 1], BEST_SELECTED);
}
console.log();
console.log("---------------------SOLUTION-----------------------------");
console.log(generation[index - 1][0]);
console.log();
console.log("OBJETS à METTRE DANS LE SAC: ");
console.log(sac.getSolution(generation[index - 1][0]));