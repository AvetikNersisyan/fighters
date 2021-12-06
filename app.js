class Fighters {
    constructor(health, damage, stamina) {
        this.health = health;
        this.damage = damage;
        this.stamina = stamina;
        this.isLost = false;

    }

    receiveDamage(damage) {
        this.healthRemained -= damage;
        if (this.healthRemained <= 0) {
            this.isLost = true;
        }
    }

    attack() {
        console.log("attack");
        return Random.randomFromTo(5, this.MaxAttack);
    }

    superAttack() {
        console.log("super");
        if (this.superAttackCount-- > 0 && this.stamina >= 0) {
            return Random.randomFromTo(this.MaxAttack, this.MaxSuperAttack);
        } else {
            this.superAttackCount = 0;
            return this.superAttackCount;
        }
    }


}


class Warriors extends Fighters {
    constructor(MaxSuperAttack, health, damage, stamina) {
        super(health, damage, stamina);
        this.MaxSuperAttack = MaxSuperAttack;
        this.MaxAttack = MaxSuperAttack / 2;
        this.superAttackCount = 1;
        this.healthRemained = this.health;
        this.regenCount = 1;
    }


    regenerate() {
        if (this.regenCount > 0) {
            const regen = Random.randomFromTo(0, 50);
            regen > this.healthRemained ? this.healthRemained = this.health : this.healthRemained += regen;
            this.regenCount--;
            return this.healthRemained;
        } else return this.healthRemained;
    }


}


class Wizards extends Fighters {

    constructor(MaxSuperAttack, ...props) {
        super(...props);
        this.MaxSuperAttack = MaxSuperAttack;
        this.MaxAttack = MaxSuperAttack / 2;
        this.superAttackCount = 3;
        this.healthRemained = this.health;
        this.spellingCount = 2;
    }


    attackBack() {
        let rand = Random.randomFromTo(1, 10);
        return rand > 6 ? this.superAttack() : this.attack() + this.ultimateStrike();
    }

    // method name from HP meaning "repairing broken bones" :)
    brackiumEmendo() {
        if (this.spellingCount > 0 && (this.healthRemained < this.health / 4)) {
            this.healthRemained *= 2;
            this.spellingCount--;
        }
    }


    ultimateStrike() {
        console.log("Ult");
        return Random.randomFromTo(1, 10) > 8 ? 2 * this.superAttack() : 0;
    }


}


class Random {
    static randomFromTo(min, max) {
        return Math.random() * (max - min) + min;
    }


}


class DOMElements {
    constructor() {
        this.controlsElement = document.getElementById("controls");
        this.attackBtn = this.controlsElement.querySelector("#attack-btn");
        this.monsterHealth = document.getElementById("monster-health");
        this.warriorHealth = document.getElementById("player-health");
        this.superAttackBtn = this.controlsElement.querySelector("#super-attack-btn");
        this.regenBtn = document.getElementById("regen-btn");

    }
}

class Game {
    constructor({wMaxSuperAttack, wHealth, wDamage, wStamina}, {wizMaxSuperAttack, wizHealth, wizDamage, wizStamina}) {
        this.warrior = new Warriors(wMaxSuperAttack, wHealth, wDamage, wStamina);
        this.wizard = new Wizards(wizMaxSuperAttack, wizHealth, wizDamage, wizStamina);
        this.elements = new DOMElements();

    }

    init() {

        // attackBtn
        this.elements.attackBtn.addEventListener("click", () => {

            if (this.wizard.isLost || this.warrior.isLost) {
                const winner = this.wizard.isLost ? "Warrior" : "Wizard";
                console.log(`${winner} has won`);
                return;
            }

            // repairs health
            this.wizard.brackiumEmendo();


            const damage = this.warrior.attack();
            this.wizard.receiveDamage(damage);
            this.elements.monsterHealth.value = this.wizard.healthRemained;


            const damageToWarrior = this.wizard.attackBack();
            this.warrior.receiveDamage(damageToWarrior);
            this.elements.warriorHealth.value = this.warrior.healthRemained;
        });

        // superAttack btn
        this.elements.superAttackBtn.addEventListener("click", () => {
            if (this.wizard.isLost || this.warrior.isLost) {
                const winner = this.wizard.isLost ? "Warrior" : "Wizard";
                console.log(`${winner} has won`);
                return;
            }

            this.wizard.brackiumEmendo();

            const damage = this.warrior.superAttack();
            this.wizard.receiveDamage(damage);
            this.elements.monsterHealth.value = this.wizard.healthRemained;



            if (damage) {
                const damageToWarrior = this.wizard.attackBack();
                this.warrior.receiveDamage(damageToWarrior);
                this.elements.warriorHealth.value = this.warrior.healthRemained;
            }


        });

        // regeneration button
        this.elements.regenBtn.addEventListener("click", () => {
            if (this.wizard.isLost || this.warrior.isLost) {
                const winner = this.wizard.isLost ? "Warrior" : "Wizard";
                console.log(`${winner} has won`);
                return;
            }

            this.warrior.healthRemained = this.warrior.regenerate();
            this.elements.warriorHealth.value = this.warrior.healthRemained;

        });
    }
}


const warrior = {
    wMaxSuperAttack: 20,
    wHealth: 100,
    wDamage: 10,
    wStamina: 50
};
const wizard = {
    wizMaxSuperAttack: 20,
    wizHealth: 100,
    wizDamage: 10,
    wizStamina: 50
};


let g = new Game(warrior, wizard);

g.init();