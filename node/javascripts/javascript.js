function range(from, to) {

    var r = Object.create(range.prototype);
    r.from = from;
    r.to = to;
    return r;
}
range.prototype = {
    includes(x) {
        return this.from <= x && x <= this.to;
    },
    *[Symbol.iterator]() {
        for (let x = Math.ceil(this.from); x <= this.to; x++) {
            yield x;
        }
    },
    toString() {
        return "(" + this.from + "..." + this.to + ")";
    }
};

// Example usage:
let r = range(1, 3);
console.log(r.includes(2)); // true
console.log(r.toString());   // (1...3)
for (let x of r) {
    console.log(x);          // 1, 2, 3
}

let F = function () { };
let p = new F();
let c = F;
console.log(c === p.constructor); // true

class rangeClass {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
    includes(x) {
        return this.from <= x && x <= this.to;
    }
    *[Symbol.iterator]() {
        for (let x = Math.ceil(this.from); x <= this.to; x++) {
            yield x;
        }
    }
    toString() {
        return "(" + this.from + "..." + this.to + ")";
    }
    static integerRangePattern = /^\s*([-+]?\d+)\s*\.\.\.\s*([-+]?\d+)\s*$/;
    static parse(s) {
        let match = s.match(rangeClass.integerRangePattern);
        if (!match) {
            throw new TypeError(`Cannot parse "${s}" as range.`);
        }
        return new rangeClass(parseInt(match[1]), parseInt(match[2]));
    }
}

// Example usage of the class:
let r2 = new rangeClass(1, 3);
console.log(r2.includes(2)); // true
console.log(r2.toString());   // (1...3)
for (let x of r2) {
    console.log(x);          // 1, 2, 3
}
