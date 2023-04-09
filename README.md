# toki-challenge

**TOKI Take Home Full Stack Challenge**

## Prerequisites

**Required**

* you should have received a `.env` file
    * it contains a variable w/ the URL for the `Cloud Function`
* you should have received a file `toki-challenge-service-account.json`
    * this is service account for the used `Google Cloud Function`

**Optional**

* you have `Docker` and `docker-compose` installed

## Main Characteristics

* backend consists of a Google `Cloud Function`
    * in order to keep service accounts a secret
        * TOKI's account for accessing their data is stored in `Google Secret Manager`
            * if the backend is run locally, the *function* makes a request to the `Secret Manager`
            * if run in production environment, the account secret is mounted as volume
                * it is then read in directly by as if it is a file
    * there is a `Cloud Trigger` on `push` event to the `main` branch
        * automated CI/CD Pipeline is started
            * using `Cloud Build` and `Cloud Run`
* frontend is written in `ReactJS` in order to respect TOKI's tech stack
    * chart is using `recharts`
        * the period of data in the charts can be adjusted via the UI w/ a `brush`
    * the client can view *Monthly*, *Daily* or *Hourly* data
        * w/ prices of the electrcity
        * or usage by the facilities he/she owns
            * the client can choose which facilities to be displayed
        * *Monthly* data shows aggregated and averaged *Monthly* data
        * *Daily* data shows aggregated and averaged *Daily* data
        * *Hourly* data shows raw data which is in *Hours*
    * the client can see *Suggestions* on how to reduce costs
        * this is based on an algorithm which finds from when until when electricity price is in a "peak"
            * this is called a `PricesIncreasedCycle`

## Project Structure

* `/app` - ReactJS SPA Application *(frontend)*
* `/common` - shared between *frontend* and *backend* datatypes
* `/functions` - Google Cloud Functions *(backend)*

## Run the Project Locally

* clone the project
    * `git clone https://github.com/vikrusev/toki-challenge.git`
* go to the root directory of the project
    * `cd toki-challenge`
* copy `toki-challenge-service-account.json` in `./functions`
* add an `./app/.env` file w/ variable *(or copy the .env.example)*
    * REACT_APP_CLOUD_FUNCTION_URL=<cloud-function-url>
* run Docker containers w/ the default `docker-compose.yml` config file
    * `docker-compose up -d`

ReactJS App should be available at `localhost:3000`

### Start the Frontend

* go to the `app` directory of the project
    * `cd ./toki-challenge/app`
* install required `npm` packages
    * `npm ci`
* run the fronend
    * `npm start`

ReactJS App should be available at `localhost:3000`

### Start the Backend

* go to the `functions` directory of the project
    * `cd ./toki-challenge/functions`
* install required `npm` packages
    * `npm ci`
* run the backend
    * `npm run watch`

### How to use the App

* visit `localhost:3000` in your browser
    * choose *Time Basis*
        * different `react-datepicker` calendars will be shown
        * choose the desired date
    * select some of the available *Metering Point Ids*
    * click the *Send Request* button
        * wait a moment for the data to load :)
    * a `recharts` chart should be shown
        * the blue line is the price of *Electricity* thourghout the time period
        * differently colored bars are the *Metering Points*
        * there is a recharts `brush` beneath the chart
            * it is used to interactively change the time period to be seen

## TODO

* more `Unit Tests`
