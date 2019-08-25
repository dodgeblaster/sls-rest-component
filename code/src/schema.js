const processSchema = () => {
    const schema = JSON.parse(process.env.SCHEMA)

    const defaultValue = {
        PK: '',
        SK: '',
        schema: {}
    }

    return Object.keys(schema).reduce((acc, s) => {
        if (sc[s].includes('@primary')) {
            acc.PK = s
            acc.schema[s] = sc[s].split(' ')[1]
            return acc
        }

        if (sc[s].includes('@sort')) {
            acc.SK = s
            acc.schema[s] = sc[s].split(' ')[1]
            return acc
        }

        acc.schema[s] = sc[s]
        return acc
    }, defaultValue)
}

module.exports = processSchema
