class DefaultMap extends Map {
    constructor(defaultValue) {
        super()
        this.defaultValue = defaultValue
    }
    get(key) {
        return this.has(key) ? super.get(key) : this.defaultValue
    }
}

class Histogram {
    constructor() {
        this.letterCounts = new DefaultMap(0)
        this.totalLetters = 0
    }
    add(text) {
        text = text.replace(/\s/g, "").toUpperCase()
        for (let character of text) {
            let count = this.letterCounts.get(character)
            this.letterCounts.set(character, count + 1)
            this.totalLetters++
        }
    }
    toString() {
        let entries = [...this.letterCounts]
        entries.sort((a, b) => a[0].localeCompare(b[0]))
        for (let entry of entries) {
            entry[1] = entry[1] / this.totalLetters * 100
        }
        entries = entries.filter(entry => entry[1] >= 1)
        let lines = entries.map(([l, n]) => `${l}: ${"#".repeat(Math.round(n))} ${n.toFixed(2)}%`)
        return lines.join("\n")
    }
}

async function histogramFromStdin() {
    process.stdin.setEncoding("utf8");//读取unicode字符，而非字节
    let histogram = new Histogram()
    for await (let chunk of process.stdin) {
        histogram.add(chunk)
    }
    return histogram
}

histogramFromStdin().then(histogram => console.log(histogram.toString()))