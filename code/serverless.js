const { Component } = require('@serverless/core')
const makePolicy = require('./makePolicy')

const makeDynamoTable = async component => {
    const dynamo = await component.load('@serverless/aws-dynamodb')
    const dynamoConfig = {
        attributeDefinitions: [
            {
                AttributeName: 'PK',
                AttributeType: 'S'
            },
            {
                AttributeName: 'SK',
                AttributeType: 'S'
            }
        ],
        keySchema: [
            {
                AttributeName: 'PK',
                KeyType: 'HASH'
            },
            {
                AttributeName: 'SK',
                KeyType: 'RANGE'
            }
        ],

        region: 'us-east-1'
    }

    const output = await dynamo(dynamoConfig)
    return output
}

const makeRole = async component => {
    const role = await component.load('@serverless/aws-iam-role')
    const roleInputs = {
        name: component.context.resourceId(),
        region: 'us-east-1',
        service: 'lambda.amazonaws.com',
        policy: makePolicy()
    }
    const output = await role(roleInputs)
    return output
}

const makeLambda = async (component, dynamo, role, schema) => {
    const lambda = await component.load('@serverless/aws-lambda')
    const lambdaConfig = {
        name: component.context.resourceId(),
        code: './code/src',
        handler: 'handler.hello',
        role: role,
        env: {
            TABLE: dynamo.name,
            SCHEMA: JSON.stringify(schema)
        }
    }

    const output = await lambda(lambdaConfig)
    return output
}

const makeApi = async (component, lambda) => {
    const apig = await component.load('@serverless/aws-api-gateway')
    const apigInputs = {
        name: component.context.resourceId(),
        description: 'An API for a Backend component',
        endpoints: [
            {
                path: '/',
                method: 'any',
                function: lambda.arn
            },
            {
                path: '/{proxy+}',
                method: 'any',
                function: lambda.arn
            }
        ]
    }

    const output = await apig(apigInputs)
    return output
}

class MyComponent extends Component {
    async default(inputs) {
        this.context.debug(`Creating resources.`)
        this.context.debug(`Waiting for resources to be provisioned.`)

        const dynamo = await makeDynamoTable(this)
        const role = await makeRole(this)
        const lambda = await makeLambda(this, dynamo, role, inputs.schema)
        const api = await makeApi(this, lambda)

        this.context.debug(`Finished Deploying!`)
        this.context.log('API url: ' + api.url)
        this.context.log('DOCS url: ' + api.url + '/docs') // not made yet
        return { url: api.url }
    }

    async remove() {
        const role = await this.load('@serverless/aws-iam-role')
        await role.remove()

        const awsLambda = await this.load('@serverless/aws-lambda')
        await awsLambda.remove()

        const dynamo = await this.load('@serverless/aws-dynamodb')
        await dynamo.remove()

        const apig = await this.load('@serverless/aws-api-gateway')
        await apig.remove()
    }
}

module.exports = MyComponent
