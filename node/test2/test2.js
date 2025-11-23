class complex {
    constructor(real, imaginary) {
        this.r = real;
        this.i = imaginary;
    }
    plus(that) {
        return new complex(this.r + that.r, this.i + that.i)
    }
    times(that) {
        return new complex(this.r * that.r - this.i * that.i, this.r * that.r + this.i * that.i)
    }
    static sum(c, d) {
        return c.plus(d)
    }
    static prodocut(c, d) {
        return c.times(d)
    }
    get real() { return this.r }
    get imaginary() { return this.i }
    get magnitude() { return Math.hypot(this.r, this.i) }
    toString() {
        return `${this.i},${this.r};`
    }
    equals(that) {
        return that instanceof complex && this.r === that.r && this.i === that.i
    }
    static ZERO = new complex(0, 0)
}
complex.ONE = new complex(1, 0)
complex.I = new complex(0, 1)
console.log(complex.ZERO);
let c = new complex(2, 3)
let d = new complex(c.i, c.r)
const c1 = c.plus(d)
console.log(c1.magnitude, 34)
console.log(c.magnitude, 35)