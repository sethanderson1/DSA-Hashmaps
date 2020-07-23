// create hash map

class HashMap {
    constructor(initialCapacity = 8) {
        this.length = 0;
        this._hashTable = [];
        this._capacity = initialCapacity;
        this._deleted = 0;
    }

    get(key) {
        const index = this._findSlot(key);
        if (this._hashTable[index] === undefined) {
            throw new Error('Key error');
        }
        return this._hashTable[index].value;
    }

    set(key, value) {
        const loadRatio = (this.length + this._deleted + 1) / this._capacity;
        if (loadRatio > HashMap.MAX_LOAD_RATIO) {
            this._resize(this._capacity * HashMap.SIZE_RATIO);
        }
        //Find the slot where this key should be in
        const index = this._findSlot(key);

        if (!this._hashTable[index]) {
            this.length++;
        }
        this._hashTable[index] = {
            key,
            value,
            DELETED: false
        };
    }

    delete(key) {
        const index = this._findSlot(key);
        const slot = this._hashTable[index];
        if (slot === undefined) {
            throw new Error('Key error');
        }
        slot.DELETED = true;
        this.length--;
        this._deleted++;
    }

    _findSlot(key) {
        const hash = HashMap._hashString(key);
        const start = hash % this._capacity;

        for (let i = start; i < start + this._capacity; i++) {
            const index = i % this._capacity;
            const slot = this._hashTable[index];
            if (slot === undefined || (slot.key === key && !slot.DELETED)) {
                return index;
            }
        }
    }

    _resize(size) {
        const oldSlots = this._hashTable;
        this._capacity = size;
        // Reset the length - it will get rebuilt as you add the items back
        this.length = 0;
        this._deleted = 0;
        this._hashTable = [];

        for (const slot of oldSlots) {
            if (slot !== undefined && !slot.DELETED) {
                this.set(slot.key, slot.value);
            }
        }
    }


    static _hashString(string) {
        let hash = 5381;
        for (let i = 0; i < string.length; i++) {
            //Bitwise left shift with 5 0s - this would be similar to
            //hash*31, 31 being the decent prime number
            //but bit shifting is a faster way to do this
            //tradeoff is understandability
            hash = (hash << 5) + hash + string.charCodeAt(i);
            //converting hash to a 32 bit integer
            hash = hash & hash;
        }
        //making sure has is unsigned - meaning non-negtive number. 
        return hash >>> 0;
    }
}


MAX_LOAD_RATIO = 0.5
SIZE_RATIO = 3


function main() {
    let lotr = new HashMap()
    lotr.set('Hobbit', 'Bilbo')
    lotr.set('Hobbit', 'Frodo')
    lotr.set('Wizard', 'Gandolf')
    lotr.set('Human', 'Aragon')
    lotr.set('Elf', 'Legolas')
    lotr.set('Maiar', 'The Necromancer')
    lotr.set('Maiar', 'Sauron')
    lotr.set('RingBearer', 'Gollum')
    lotr.set('LadyOfLight', 'Galadriel')
    lotr.set('HalfElven', 'Arwen')
    lotr.set('Ent', 'Treebeard')
    console.log(lotr)
    console.log(lotr.get('Maiar'))
    console.log(lotr.get('Hobbit'))



}

console.log('main()', main())






// WhatDoesThisDo

const WhatDoesThisDo = function () {
    let str1 = 'Hello World.';
    let str2 = 'Hello World.';
    let map1 = new HashMap();
    console.log('map1', map1)
    map1.set(str1, 10);
    map1.set(str2, 20);
    let map2 = new HashMap();
    console.log('map2', map2)
    let str3 = str1;
    let str4 = str2;
    map2.set(str3, 20);
    map2.set(str4, 10);

    console.log('map1.get(str1)', map1.get(str1))
    console.log('map2.get(str3)', map2.get(str3))
}


// creates collisions


// [null, [28, 19, 10], 20, 12, null, 5, [15, 33], null, 17]

//[null, [28, 19, 10], 20, 12, null, 5, [15, 33], null, 17]


// remove duplicates 

function removeDuplicates(string) {
    const map = new Map();
    let newStr = '';
    string.split('').forEach(letter => {
        if (!map.has(letter)) {
            map.set(letter, '');
            newStr += letter;
        }
    });
    return newStr;
}

console.log('removeDuplicates(\'google\')', removeDuplicates('google'))
console.log('removeDuplicates(\'google all that you think can think of\')', removeDuplicates('google all that you think can think of'))


// Any permutation a palindrome


function palindrome(str) {
    const result = new Map();
    for (let i = 0; i < str.length; i++) {
        // console.log('result', result)

        if (!result.delete(str[i])) {
            result.set(str[i], 1);
        }
    }
    if (result.size <= 1) {
        return true;
    } return false;
}

console.log('palindrome(\'acecarr\')', palindrome('acecarr'))
console.log('palindrome(\'north\')', palindrome('north'))



// Anagram grouping
// ******












class HashMap_SepChain {
    constructor(initialCapacity = 8) {
        this.length = 0;
        this._hashTable = [];
        this._capacity = initialCapacity;
    }

    get(key) {
        const hash = HashMap_SepChain._hashString(key);
        const index = hash % this._capacity;
        const slot = this._hashTable[index];

        if (slot === undefined) {
            throw new Error('Key Error');
        }

        for (let i = 0; i < slot.length; i++) {
            if (slot[i].key === key) {
                return slot[i].value;
            }
        }
    }

    static _hashString(string) {
        let hash = 5381;
        for (let i = 0; i < string.length; i++) {
            hash = (hash << 5) + hash + string.charCodeAt(i);
            hash = hash & hash;
        }
        return hash >>> 0;
    }

    set(key, value) {
        const loadRatio = (this.length + this._deleted + 1) / this._capacity;
        if (loadRatio > HashMap_SepChain.MAX_LOAD_RATIO) {
            this._resize(this._capacity * HashMap_SepChain.SIZE_RATIO);
        }

        const hash = HashMap_SepChain._hashString(key);
        const index = hash % this._capacity;

        if (!this._hashTable[index]) {
            this._hashTable[index] = [];
        }

        for (let i = 0; i < this._hashTable[index].length; i++) {
            if (this._hashTable[index][i].key === key) {
                return this._hashTable[index][i].value = value;
            }
        }

        this.length++;
        this._hashTable[index].push({
            key,
            value
        });
    }

    _resize(size) {
        const oldSlots = this._hashTable;
        this._capacity = size;
        this.length = 0;
        this._hashTable = [];

        for (const slot of oldSlots) {
            if (slot !== undefined) {
                slot.forEach(obj => this.set(obj.key, obj.value));
            }
        }
    }

    delete(key) {
        const hash = HashMap_SepChain._hashString(key);
        const index = hash % this._capacity;
        const slot = this._hashTable[index];

        if (slot === undefined) {
            throw new Error('Key Error');
        }

        for (let i = 0; i < slot.length; i++) {
            if (slot[i].key === key) {
                this.length--;
                this._hashTable[index].splice(i, 1);
                break;
            }
        }
    }
}




HashMap_SepChain.MAX_LOAD_RATIO = 0.5;
HashMap_SepChain.SIZE_RATIO = 3;


// Separate Chaining

function sepChainMain() {
    const lotr = new HashMap_SepChain;
    const data = [
        { 'Hobbit': 'Bilbo' },
        { 'Hobbit': 'Frodo' },
        { 'Wizard': 'Gandolf' },
        { 'Human': 'Aragon' },
        { 'Elf': 'Legolas' },
        { 'Maiar': 'The Necromancer' },
        { 'Maiar': 'Sauron' },
        { 'RingBearer': 'Gollum' },
        { 'LadyOfLight': 'Galadriel' },
        { 'HalfElven': 'Arwen' },
        { 'Ent': 'Treebeard' }];
    data.forEach(obj => {
        const key = Object.keys(obj)[0];
        lotr.set(key, obj[key]);
    });
    console.log(lotr);
}

sepChainMain();
