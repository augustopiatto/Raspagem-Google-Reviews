<!--
title: 'AWS NodeJS Example'
description: 'This template demonstrates how to deploy a NodeJS function running on AWS Lambda using the traditional Serverless Framework.'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
priority: 1
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->


# Serverless Framework AWS NodeJS Example

This template demonstrates how to deploy a NodeJS function running on AWS Lambda using the traditional Serverless Framework. The deployed function does not include any event definitions as well as any kind of persistence (database). For more advanced configurations check out the [examples repo](https://github.com/serverless/examples/) which includes integrations with SQS, DynamoDB or examples of functions that are triggered in `cron`-like manner. For details about configuration of specific `events`, please refer to our [documentation](https://www.serverless.com/framework/docs/providers/aws/events/).

## Usage

### Deployment

In order to deploy the example, you need to run the following command:

```
$ serverless deploy
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-project-dev (112s)

functions:
  hello: aws-node-project-dev-hello (1.5 kB)
```

### Invocation

After successful deployment, you can invoke the deployed function by using the following command:

```bash
serverless invoke --function hello
```

Which should result in response similar to the following:

```json
{
    "statusCode": 200,
    "body": "{\n  \"message\": \"Go Serverless v3.0! Your function executed successfully!\",\n  \"input\": {}\n}"
}
```

### Local development

You can invoke your function locally by using the following command:

```bash
serverless invoke local --function hello
```

Which should result in response similar to the following:

```
{
    "statusCode": 200,
    "body": "{\n  \"message\": \"Go Serverless v3.0! Your function executed successfully!\",\n  \"input\": \"\"\n}"
}
```
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Minhas anotações até agora

Não vou montar o README bonitinho pq to descobrindo algumas coisas ainda

Doc do serverless (https://www.serverless.com/framework/docs/tutorial)

Doc da URL do Google Review (https://developers.google.com/my-business/content/review-data?hl=pt-br)

API do Google para IDs (https://developers.google.com/maps/documentation/places/web-service/place-id?hl=pt-br):
ID Nema 595 - ChIJ05IwXQfVmwAR1oh7vekNWno
ID Nema Humaita - ChIJSarVod9_mQARoFamN9SL0IY
ID Nema Leblon - ElRBdi4gQXRhdWxmbyBkZSBQYWl2YSwgMTEyMCAtIGxvamEgYyAtIExlYmxvbiwgUmlvIGRlIEphbmVpcm8gLSBSSiwgMjI0NDAtMDM1LCBCcmF6aWwiIhogChYKFAoSCTdqoTaz1ZsAEV4JJmEJdXrGEgZsb2phIGM

Dois fluxos pensados até agora utilizando serverless framework e lambda:
1. função que pega todas locations e data da ultima review de cada location -> fila do sqs (a mensagem seria um json do tipo {locationId: <id>, lastRview:<datetime>} -> função que roda pegando batches de N locations e faz as capturas e inserts
2. faz um script que roda tudo em uma função

Penso que faz mais sentido o fluxo 1, mesmo que aumente a complexidade. A ideia do negócio da Arcca é aumentar com o tempo e com isso se torna necessário fazer um sistema que seja escalável, ainda que hoje em dia leve um tempo razoalvemente menor fazendo pelo método 2 (testar e pegar essa diferença de tempo).

TODO - Ver como linkar o postgres (https://aws.amazon.com/pt/rds/)

TODO - Ver como funciona a fila da AWS (https://aws.amazon.com/pt/sqs/)
