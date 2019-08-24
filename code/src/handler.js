const aws = require('aws-sdk')
const validate = require('./validator')
const http = require('http')

const dynamo = new aws.DynamoDB.DocumentClient()
const TABLE = process.env.TABLE

/**
 * Get All
 *
 * Note:
 * It is not recommended to do scans ont tables. This is temporary until
 * a good api is determined for how to define get all queries
 */
const getAll = async () => {
    const params = {
        TableName: TABLE
    }

    const results = await dynamo.scan(params).promise()
    const formatted = results.Items.map(x => ({
        name: x.name,
        age: x.age
    }))

    return http.out({
        data: formatted
    })
}

/**
 * Put
 *
 *
 */
const put = async event => {
    const data = JSON.parse(event.body)
    const schema = JSON.parse(process.env.SCHEMA)

    try {
        validate({
            name: 'api',
            schema,
            data
        })
    } catch (e) {
        return http.error400({
            message: e.message
        })
    }

    const params = {
        TableName: TABLE,
        Item: {
            PK: 'data',
            SK: 'date' + Date.now().toString(),
            name: data.name,
            age: data.age
        }
    }

    await dynamo.put(params).promise()

    return http.out({
        name: data.name,
        age: data.age
    })
}

module.exports.hello = async (event, context, cb) => {
    if (event.httpMethod === 'GET') {
        return await getAll()
    }

    if (event.httpMethod === 'POST') {
        return await put(event)
    }

    return http.error500({
        message: event.httpMethod + ' HTTP method is not supported'
    })
}
