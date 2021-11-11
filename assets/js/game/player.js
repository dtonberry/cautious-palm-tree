let player = {
    level: 1,
    gold: 100,
    experience: 0,

    head: {},
    chest: {},
    legs: {},
    boots: {},
    weapon: {},

    totalHp: 0,
    totalDmg: 0
}

let inventory = {
    slot1: {},
    slot2: {},
    slot3: {},
    slot4: {},
    slot5: {},
    slot6: {}
}

class Player {
    constructor(player, inventory) {
        this.player = player;
        this.inventory = inventory;
    }
}