export default class KnapsackProblem {
    object = [];
    capacity = 0;
    initial = "";

    constructor(capacity, object) {
        this.capacity = capacity;
        this.object = object;
        for (let i = 0; i < object.length; i++)
            this.initial += '0';
    }

    addObject(value, weight) {
        const id = this.object[this.object.length - 1].id + 1;
        let newObject = {
            id: id,
            value: value,
            weight: weight
        }
        this.object.push(newObject);
    }

    createIndividual() {
        let individual = this.initial;
        while (individual == this.initial) {
            individual = "";
            for (let i = 0; i < this.object.length; i++) {
                const nb = Math.random();
                individual += (nb > 0.5) ? 1 : 0;
            }
        }
        return individual;
    }

    fitness(individual, index) {
        let weight = 0;
        let value = 0;
        for (let i = 0; i < individual.length; i++) {
            if (individual[i] == '1') {
                weight += this.object[i].weight;
                value += this.object[i].value;
            }
        }
        return { index: index, weight: weight, value: value };
    }

    generatePopulation(nb) {
        let population = [];
        for (let i = 0; i < nb; i++)
            population.push(this.createIndividual());
        return population;
    }

    allFitnessPopulation(population) {
        let tmp = [];
        population.forEach((element, index) => {
            tmp.push(this.fitness(element, index));
        });
        return tmp;
    }

    filterPopulation(population) {
        let tmp = this.allFitnessPopulation(population);
        const data = tmp.reduce((val, elem) => {
            (elem.weight <= this.capacity) ? val.lowWeight.push(elem) : val.highWeight.push(elem)
            return val;
        }, { highWeight: [], lowWeight: [] });

        const { highWeight, lowWeight } = data;
        if (highWeight.length > 1) {
            highWeight.sort((a, b) => {
                return a.weight - b.weight;
            });
        }
        if (lowWeight.length > 1) {
            lowWeight.sort((a, b) => {
                return b.value - a.value;
            });
        }
        const fitnessResult = [...lowWeight, ...highWeight];
        const result = [];
        fitnessResult.forEach(element => {
            result.push(population[element.index]);
        });
        return { result, fitnessResult };
    }

    rouletSelection(alreadySelected, NB_SELECTED) {
        while (true) {
            const r = Math.floor(Math.random() * NB_SELECTED);
            if (alreadySelected != r)
                return r;
        }
    }

    crossover(dad, mum) {
        const NB_OBJECT = this.object.length;
        let child1 = dad;
        let child2 = mum;
        if (NB_OBJECT > 1) {
            let r = Math.floor(Math.random() * ((NB_OBJECT - 1) - 1)) + 1; // value [1,(NB_OBJECT-1)]
            child1 = dad.substring(0, r) + mum.substring(r);
            child2 = mum.substring(0, r) + dad.substring(r);
        }
        return { child1, child2 };
    }

    mutation(individual) {
        while (true) {
            let index = Math.floor(Math.random() * this.object.length);
            let tmp = individual.split("");
            tmp[index] = (tmp[index] == '0') ? 1 : 0;
            individual = tmp.join("");
            if (individual != this.initial)
                return individual;
        }
    }

    generateNewPopulation(nb, population, NB_BEST_SELECTED) {
        let newPopulation = [];
        for (let i = 0; i < (nb / 2); i++) {
            let index1 = this.rouletSelection(-1, NB_BEST_SELECTED);
            let index2 = this.rouletSelection(index1, NB_BEST_SELECTED);
            //crossover 2 fois
            let child = this.crossover(population[index1], population[index2]);
            child = this.crossover(this.mutation(child.child1), this.mutation(child.child2));
            newPopulation.push(this.mutation(child.child1), this.mutation(child.child2));
        }
        return newPopulation;
    }
    getSolution(individual) {
        const result = [];
        for (let index = 0; index < individual.length; index++) {
            if(individual[index]  == '1')
                result.push(index + 1);
        }
        return result;
    }
}