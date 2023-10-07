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

---

# Minhas anotações até agora

Não vou montar o README bonitinho pq to descobrindo algumas coisas ainda

## Google API

Tutorial de como usar a API do Google (https://jingwen-z.github.io/how-to-get-places-reviews-on-google-maps-by-place-api/).
Doc oficial da API (https://developers.google.com/maps/documentation/places/web-service/details?hl=pt-br) - Usar parameters.

Google geralmente altera o ID dos locais, para fazer a busca, vou usar a API (https://maps.googleapis.com/maps/api/geocode/json?address=${address}&sensor=false&key=${API_KEY}):

```
Retorno do endpoint
{
  "results" : [
    {
      ...,
      "place_id": "ChIJtYuu0V25j4ARwu5e4wwRYgE",
      ...
    },
    ...
  ]
}
```

Para fazer a busca dos reviews de cada local, vou usar a API (https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&reviews_sort=newest&key=${API_KEY}):

```
Retorno do endpoint
{
  "html_attributions" : [],
  "result" : {
    ...
    "reviews" :
      [
         {
            "author_name" : "A . Daniel",
            "author_url" : "https://www.google.com/maps/contrib/115135628913900329576/reviews",
            "language" : "pt",
            "original_language" : "pt",
            "profile_photo_url" : "https://lh3.googleusercontent.com/a-/ALV-UjVlBRFWne2_0BqRDPjHJ6fXytKzEcGkSPNoVFceXt5O-c4=s128-c0x00000000-cc-rp-mo",
            "rating" : 5,
            "relative_time_description" : "uma semana atrás",
            "text" : "Time 595 muito educados e simpáticos melhor loja equipe sol",
            "time" : 1695422512,
            "translated" : false
         },
          ...
      ],
      ...
  }
}
```

## Serverless

Implementar Lambda na AWS usando Serverless Node (https://www.youtube.com/watch?v=oFYFqOzJdqY)

Doc do serverless (https://www.serverless.com/framework/docs/tutorial)

## AWS

TODO - Ver como linkar o postgres (https://aws.amazon.com/pt/rds/)

TODO - Ver como funciona a fila da AWS (https://aws.amazon.com/pt/sqs/)

## Fluxos pensados

Dois fluxos pensados até agora utilizando serverless framework e lambda:

1. função que pega todas locations e data da ultima review de cada location -> fila do sqs (a mensagem seria um json do tipo {locationId: <id>, lastRview:<datetime>} -> função que roda pegando batches de N locations e faz as capturas e inserts)
2. faz um script que roda tudo em uma função

Penso que faz mais sentido o fluxo 1, mesmo que aumente a complexidade. A ideia do negócio da Arcca é aumentar com o tempo e com isso se torna necessário fazer um sistema que seja escalável, ainda que hoje em dia leve um tempo razoalvemente menor fazendo pelo método 2 (testar e pegar essa diferença de tempo).

## Observações

Os secrets do .env foram enviados à AWS por meio do sls deploy, como variáveis

## O que fazer

- Criar layer no Lambda com Node para o import do SQS
- Ver doc pra ver como chegam as mensagens no segundo metodo
- Começar a testar o banco (RDS) e biblioteca pra falar com o banco
- Adicionar a biblioteca do banco na layer
- Fazer um hash usando Nome do autor, data do comentário e o texto (ou parte dele) para gerar um ID no banco e verificar se o registro já existe
