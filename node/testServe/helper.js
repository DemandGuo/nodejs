export function cleanRedundantPrefix(name, prefix) {
    if (!prefix) return name;
    while (name.startsWith(prefix)) {
        const after = name.substring(prefix.length)
        if (after.startsWith(prefix)) {
            name = after
        }
        break;
    }
    return name
}

export function cleanRedundantSuffix(name, suffix) {
    if (!suffix) return name;
    while (name.endsWith(suffix)) {
        const before = name.substring(0, name.length - suffix.length);
        if (before.endsWith(suffix)) {
            name = before;
        } else {
            break;
        }
    }
    return name;
}
