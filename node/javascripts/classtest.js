class Complex {
    constructor(real, imaginary) {
        this.r = real;
        this.i = imaginary;
    }
    plus(that) {
        return new Complex(this.r + that.r, this.i + that.i);
    }
    times(that) {
        return new Complex(
            this.r * that.r - this.i * that.i,
            this.r * that.i + this.i * that.r
        );
    }
    static sum(c1, c2) {
        return c1.plus(c2);
    }
    static product(c1, c2) {
        return c1.times(c2);
    }
    get real() {
        return this.r;
    }
    get imaginary() {
        return this.i;
    }
    toString() {
        return `${this.r} + ${this.i}i`;
    }
    equals(that) {
        return that instanceof Complex &&
            this.r === that.r &&  
            this.i === that.i;
    }
}

Complex.ZERO = new Complex(0, 0);
Complex.ONE = new Complex(1, 0);
Complex.I = new Complex(0, 1);

console.log(Complex.ZERO.toString()); // "0 + 0i"