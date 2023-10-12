# Application setup

## Install dependencies

```bash
npm i
```

## Connect Serverless with AWS

```bash
serverless
```

## Install deps

```bash
npm i
```

## Set up .env

You have .env file in which you have to specify some params that will be used alongside the app
Make sure to check .env.example in the root of this project (not whole repo).
Providee required AWS credentials and verified SES email for sender and receiver (if you about to test this feature.)

## Set up CORS options

If you're about to test it on your local, that's ok to put "\*" instead of "https://link-shortener-8qb2.vercel.app" everywhere in the app. Otherwise put the proper link.

### ARN

Also I'm not sure, but probably you have to specify proper ARN for for each resource in serverless.yml

## Deploy app

```bash
serverless deploy
```

## Run app

```bash
serverless offline
```
