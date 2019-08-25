const input = (schema, PK, SK, data) => {
    return Object.keys(schema).reduce((acc, x) => {
        if (x === PK) {
            acc.PK = data[x]
            return acc
        }
        if (x === SK) {
            acc.SK = data[x]
            return acc
        }

        acc[x] = data[x]
        return acc
    }, {})
}

const out = (schema, PK, SK, data) => {
    return Object.keys(schema).reduce((acc, x) => {
        if (x === PK) {
            acc[x] = data.PK
            return acc
        }
        if (x === SK) {
            acc[x] = data.SK
            return acc
        }

        acc[x] = data[x]
        return acc
    }, {})
}

module.exports = {
    out,
    in: input
}
