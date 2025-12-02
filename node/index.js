function hello(){
    console.log('hello')
}
hello()
const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

// 输出: <Buffer 12 34 56 78 90 ab>
console.log(buf);