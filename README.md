# Rapagem do Google Reviews

## Visão geral do projeto

Este é um projeto que usa Serverless Framework, AWS Lambda, AWS SQS e RDS PostgreSQL.

É uma stack de desenvolvimento moderna para se facilitar a criação de tasks recorrentes.

## Preview

O objetivo é gerar um registro das reviews de 3 locais específicos de tempo em tempo, de forma a facilitar seu acesso futuro e fazer análises a partir destes dados.

### Opções de projetos de captura de dados do Google Reviews

1. Chamada à API usando Lambda, SQS e RDS.

   1.1 Vantagens

   - Controle sobre a aplicação.
   - Controle de custos.

   1.2 Desvantagens

   - Limite de respostas pela API (somente 5 reviews por requisição).
   - Dependência de outro método (ex: Web Scraping) para o preenchimento inicial do banco, devido ao retorno limitado da API.
   - Necessário conhecimento técnico de programação para montar o processo.

   [Caminho para implementação](#começando)

2. Web Scraping. Ex: [Scrapy](https://scrapy.org/).

   2.1 Vantagens

   - Baixo custo.
   - Execução rápida.

   2.2 Desvantagens

   - Mudanças no layout/código HTML podem prejudicar a funcionalidade do seu bot/crawler (manutenção contínua).
   - O processo de setup é complexo.
   - Os bots/crawlers podem ser bloqueados pelo site.

   Caminho para implementação (com Scrapy):

   - [Parte 1](https://scrapeops.io/python-scrapy-playbook/scrapy-beginners-guide/)
   - [Parte 2](https://scrapeops.io/python-scrapy-playbook/scrapy-beginners-guide-cleaning-data/)
   - [Parte 3](https://scrapeops.io/python-scrapy-playbook/scrapy-beginners-guide-storing-data/)
   - [Parte 4](https://scrapeops.io/python-scrapy-playbook/scrapy-beginners-guide-user-agents-proxies/)
   - [Parte 5](https://scrapeops.io/python-scrapy-playbook/scrapy-beginners-guide-deployment-scheduling-monitoring/)


3. Serviço de terceiro (ex: [Blender para uso de API](https://www.blendo.co/) ou [Zyte para uso de Web Scraping](https://www.zyte.com/)).

   3.1 Vantagens

   - Implementação rápida.
   - Suporte em caso de problemas.
   - Não há necessidade de conhecimento técnico de programação para implementação.

   3.2 Desvantagens

   - Custoso à longo prazo.
   - Perder as informações ou serviço em término de contrato.

   [Caminho para implementação](https://www.blendo.co/documents/blendo-integrations/)

### Fluxos pensados

Dois fluxos pensados até agora utilizando Serverless Framework e Lambda:

1. Função que pega todas locations, reviews e data da última review de cada location -> fila do SQS (a mensagem seria um json do tipo `{id: <id>, comentario: <string>, data: <datetime>, loja: <string>, avaliacao: <int>}`) -> função que roda pegando batches de N locations e faz as capturas e inserts.

   1.1 Vantagens

   - Facilita a escalabilidade conforme mais lojas vão sendo aderidas à empresa.
   - Poucas mudanças necessárias até que se chegue em um número realmente gigante de reviews (com periodicidade de 4 minutos, esse valor chegar a 3000 reviews - o Lambda de `getPlacesReviews` leva perto de 800ms-900ms para extrair 15 reviews). Ainda assim, pode-se paralelizar a busca de cada loja nesta mesma API para aumentar eficiência.

   1.2 Desvantagens

   - Mais complexo de se implementar, pois exige a separação em dois métodos e o uso de fila.
   - Aumento no consumo de dinheiro à AWS por gastar mais recursos.

2. Faz um script que roda tudo em uma função

   2.1 Vantagens

   - Implementação inicial mais simples.
   - Uso de menos recursos da AWS, e economia de dinheiro.

   2.2 Desvantagens

   - Baixa escalabilidade, precisa de mais suporte dos devs à longo prazo.

#### Fluxo escolhido

Penso que faz mais sentido o fluxo 1, mesmo que aumente a complexidade. A ideia do negócio é aumentar com o tempo e com isso se torna necessário fazer um sistema que seja escalável, ainda que hoje em dia leve um tempo menor fazendo pelo método 2.

![Fluxo](./src/assets/fluxo.png)

## Começando

Para iniciar o projeto, siga os passos abaixo:

- Clone o repositório em sua máquina local.
- Pelo terminal, entre na pasta em que o projeto foi clonado e rode `npm install`.
- Faça o setup da sua conta Google:
  - Crie uma conta.
  - Siga este [tutorial](https://developers.google.com/maps/documentation/elevation/cloud-setup?hl=pt-br) para criar um projeto, ativar as APIs de Place e Geocoding, e gerar sua chave do Google API.
- Faça o setup da sua conta AWS:
  - Crie uma conta na AWS, entre no IAM da AWS, crie um usuário e salve suas chaves geradas em csv durante o processo.
  - Crie uma pasta oculta `.aws` no seu root e nela salve as chaves geradas em um arquivo `credentials` (obs: sem extensão) da seguinte forma:
    ```
    [default]
    aws_access_key_id = chave1
    aws_secret_access_key = chave2
    ```
  - Entre no serviço SQS da AWS e crie uma fila.
  - Entre no serviço RDS da AWS e crie um banco Postgres.
  - Crie um arquivo `.env` no seu projeto e copie as variáveis do arquivo `sample.env` e preencha com as suas.

## Estrutura de pasta

```
├── .serverless              # Pasta gerada pelo deploy do Serverless
├── config                   # Configurações
│   ├── db.js                # Variáveis do banco RDS
├── migrations               # Migrações dos modelos criados
├── models                   # Modelos
├── node_modules             # Módulos utilizados no código
├── src                      # Código fonte
│   ├── assets               # Pasta com arquivos estáticos
│   ├── functions            # Pasta com as funções lambdas
│   └── helpers              # Pasta com funções de suporte
├── serverless.yml           # Configurações do projeto para uso da AWS
├── package.json             # Pacotes associados ao projeto
├── sample.env               # Exemplo de arquivo .env
└── README.md                # Documentação do projeto
```

## Tecnologias e funcionalidades

### Tecnologias

O projeto inclui as seguintes tecnologias:

- Serverless para abstrair a criação de funções Lambdas, EventBridge, filas SQS.
- AWS para uso de Lambda, EventBridge, SQS e RDS PostgreSQL, na execução de métodos simples.
- Google Place API e Geocode API para obtenção de dados dos clientes.
- Node.js para desenvolvimento e criação de métodos.
- Bibliotecas Client SQS para gerenciamento de fila e Objection.js (depende de bibliotecas pg e knex) para ORM de queries.

### Funcionalidades

O projeto possui as seguintes funcionalidades:

- Criar funções Lambda a partir de código local.
- Rodar o método `getPlacesReviews` a cada 4 minutos usando EventBridge e enviar seu retorno para uma fila SQS.
- Rodar o método `saveReviews` a cada 4 minutos, consumindo a fila SQS e enviar as informações para armazenamento em banco RDS Postgres e estruturação de dados.

## Scripts

O projeto inclui os seguintes scripts:

`sls deploy`: Gera automaticamente a pilha com suas funções da AWS no seu painel, além de gerar um trigger para sua fila começar a funcionar.
`sls invoke --function nomeDaFunção`: Executa uma função específica.
`sls remove`: Remove a pilha e o trigger da fila.

## Decisões técnicas

### Google

- Uso da api Geocode API usando o endereço das lojas para obtenção do `locationId` do comércio, pois é um [valor variável](https://developers.google.com/maps/documentation/places/web-service/place-id?hl=pt-br#id-overview):
  - [https://maps.googleapis.com/maps/api/geocode/json?address=${address}&sensor=false&key=${API_KEY}](https://developers.google.com/maps/documentation/geocoding?hl=pt-br):
  ```
  Retorno do endpoint
  {
    "results" : [
      {
        ...,
        "formatted_address": "R. Visc. de Pirajá, 595 - Ipanema, Rio de Janeiro - RJ, 22410-003, Brasil",
        "place_id": "ChIJtYuu0V25j4ARwu5e4wwRYgE",
        ...
      },
      ...
    ]
  }
  ```
- Uso da api Places API para obtenção das `reviews` de cada `location`:
  - [https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&reviews_sort=newest&key=${API_KEY}](https://developers.google.com/maps/documentation/places/web-service/details?hl=pt-br)
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

### AWS

- Por causa do retorno da Places API só trazer 5 `reviews`, se usa um eventBridge da AWS para que se busque as `reviews` de X em X minutos e seja enviado o retorno à uma fila SQS da AWS para enviar essas informações à função lambda `saveReviews` quer irá usar RDS da AWS para salvar em um banco Postgres.

#### Lambda

Como é criado a partir do Serverless, se pode ver as configs no arquivo `serverless.yml`.

#### SQS

![SQS](./src/assets/sqs.png)
Foi feita diretamente no painel da AWS, existe mesmo quando a stack é removida.
Ao dar deploy do Serverless, um trigger é criado para o funcionamento da fila.

#### RDS

![Config](./src/assets/painel_db.png)
![Postgres](./src/assets/dbeaver.png)
Foi feito diretamente no painel da AWS, existe mesmo quando a stack é removida.

## Referências

### Serverless

- [Doc do serverless](https://www.serverless.com/framework/docs/tutorial).
- [Implementar Lambda na AWS usando Serverless Node](https://www.youtube.com/watch?v=oFYFqOzJdqY).
- [Implementar Layer na AWS usando Serverless Node](https://www.youtube.com/watch?v=aKD9Vftr6i4&t).
- [Implementar RDS Postgres na AWS usando Serverless Node](https://medium.com/the-dev-caf%C3%A9/creating-a-serverless-rest-api-with-node-js-aws-lambda-api-gateway-rds-and-postgresql-303b0baac834).
- [Doc do Objection](https://vincit.github.io/objection.js/)
- [Doc do knex](https://knexjs.org/)

### AWS

- [Doc de fila SQS da AWS](https://aws.amazon.com/pt/sqs/).
- [Doc do RDS da AWS](https://aws.amazon.com/pt/rds/).

## Melhorias futuras

- Fazer a criação da fila SQS pelo serverless.
- Fazer Layers para os módulos usados em cada Lambda.
- Usar WebScraping para puxar dados mais antigos e preencher no banco.
