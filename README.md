# toki-challenge

**TOKI Take Home Full Stack Challenge**

## Prerequisites

Optional

* docker
* docker-compose

## Main Characteristics

* backend consists of a Google `Cloud Function`
    * TOKI's account for accessing their data is stored in `Google Secret Manager`
        * if run locally, the function makes a request to the `Secret Manager`
        * if run in production environment, the account secret is mounted as volume
            * it is then read in directly by as if it is a file
    * there is a `Cloud Trigger` on `push` event to the `main` branch
        * automated CI/CD Pipeline is started
            * using `Cloud Build` and `Cloud Run`
* frontend is written in `ReactJS`
    * charts are using `recharts`
        * the period of data in the charts can be adjusted via the `UI`
    * the client can view *Monthly*, *Daily* or *Hourly* data
        * w/ prices of the electrcity
        * or usage by the facilities he/her owns
            * the client can choose which facilities to be displayed
    * *Yearly* data shows aggregated and averaged *Monthly* data
    * *Monthly* data shows aggregated and averaged *Daily* data
    * *Daily* data shows raw data which is in *Hours*

## Project Structure

* `/app` - ReactJS SPA Application *(frontend)*
* `/common` - shared between *frontend* and *backend* datatypes
* `/functions` - Google Cloud Functions *(backend)*

## Run the Project Locally

* clone the project
    * `git clone https://github.com/vikrusev/toki-challenge.git`
* go to the root directory of the project
    * `cd toki-challenge`
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
* visit `localhost:3000` in your browser
    * choose *year*, *month* and *day*
        * *month* and *day* '00' are considered as `null`
    * fill in *Metering Point Ids*
        * should be a comma seperated list of meterin points that you want to check
            * available from TOKI are `1234` and `5678`
    * click the `Submit` button
        * wait a moment for the data to load :)
            * adding a loading spinner is a **TODO**

### Start the Backend

* go to the `functions` directory of the project
    * `cd ./toki-challenge/functions`
* install required `npm` packages
    * `npm ci`
* run the backend
    * `npm run watch`

## TODO

* algorithm to suggest how to cut costs based on the provided data
* Unit Tests
* `X-Axis` datetime when viewing data for a single day should be parsed
* move `frontend` user input interface to a seperate component
    * loading spinner on submit button click
    * improve frontend design
* improve error handling system
* improve `README` documentation
* most types in `/common/data.types.ts` should be moved to `/functions`
* a simple `Docker` setup can be implemented
* etc
