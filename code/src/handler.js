const aws = require('aws-sdk')
const validate = require('./validator')
const http = require('./http')
const format = require('./format')
const getSchema = require('./schema')

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

    const { PK, SK, schema } = getSchema()

    const results = await dynamo.scan(params).promise()
    const formatted = results.Items.map(x => {
        return format.out(schema, PK, SK, x)
    })

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

    const { PK, SK, schema } = getSchema()

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
        Item: format.in(schema, PK, SK, data)
    }

    await dynamo.put(params).promise()
    return http.out(data)
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
