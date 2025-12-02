// console.log('A同步')
// process.nextTick(() => {
//     console.log('B同步')
//     Promise.resolve().then(() => {
//         console.log('E同步')
//     })
// })

// Promise.resolve().then(() => {
//     console.log('C同步')
//     process.nextTick(() => {
//         console.log('D同步')
//     })
// })

setTimeout(() => {
    console.log('F异步')
})
setImmediate(() => {
    console.log('G异步')
})