/**
 * validate
 *
 * Very simple validator that just checks if the key exists and
 * if its the correct type (using typeof)
 *
 * TODO:
 * - swap this for Joi or AJV
 */

const exists = (data, key) => {
    if (!data[key]) {
        throw new Error(key + ' must be defined')
    }
}

const isSameType = (data, schema, key) => {
    const schemaType = schema[key]
    const dataType = typeof data[key]

    if (dataType !== schemaType) {
        const message = `Expected ${key} to be ${schemaType}, but received ${dataType}`
        throw new Error(message)
    }
}

const validate = ({ name, schema, data }) => {
    Object.keys(schema).forEach(key => {
        exists(data, key)
        isSameType(data, schema, key)
    })
}

module.exports = validate
