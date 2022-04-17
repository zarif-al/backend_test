# **Backend Api**

## **Project Details**

This is a RESTApi that can read customer details from a csv and insert it into a database and return the customer details.

### **Design**

When the customer uploads a file, they will get a response only when all records have been written to the database.

I did this because if the request is released immediately then the user has no way of knowing when the db writes have completed. I might be able to set up another endpoint where the user can request to get db write progress, however I am not sure about the complexity that would add to this project. Another alternative I can think of would be to use a web socket for the upload endpoint.

The uploaded file is stored in a temporary folder and read via stream. Chunks of data are passed to the insert method and written to db via bulk insert. When the read is complete, the file is deleted.

## **Docker Setup**

**API Endpoint**

```
http://localhost:8080
```

**Database Endpoint**

```
http://localhost:3037
```

### **Unit Tests**

```

docker-compose -f docker-compose.test-unit.yml build
docker-compose -f docker-compose.test-unit.yml run --rm api

```

### **E2E Tests**

```

docker-compose -f docker-compose.test-e2e.yml build
docker-compose -f docker-compose.test-e2e.yml up

```

please remember to run the following command when finished.

```

docker-compose -f docker-compose.test-e2e.yml down

```

### **Production**

```
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up

```

please remember to run the following command when finished.

```

docker-compose -f docker-compose.prod.yml down

```

## **Get Customers**

Return array of enabled customers from database according to provided pagination options.

- **URL**

  /customers

- **Method:**

  `GET`

- **URL Params**

  **Optional:**

  `offset=[number]`<br/>
  `limit=[number]`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:** <br />
    `[ {"name": "Adelaida Allsup", "email": "aallsup46@behance.net", "address": "041 Annamark Hill", "enabled": true, "emailScheduleTime": "2021-09-29T05:19:09.000Z", "emailBodyTemplate": "Hi Adelaida Allsup,"} ] `

- **Error Response:**

  - **Code:** 400 <br />
    **Content:** `{ "statusCode": 400, "message": "Invalid offset or limit", "error": "Bad Request" }`

- **Sample Call:**

  ```
  http://localhost:8080/customers?offset=0&limit=10
  ```

## **Import Customers**

Upload a csv file to the server and it will be parsed and inserted into the database.

- **URL**

  /import-customers

- **Method:**

  `POST`

- **Data Params**

  `csv=[csv file]`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:** `{ "message": "Success", "code": 200, "details": [] }`

- **Error Response:**

  - **Code:** 201 <br />
    **Content:** `{ "message": "Some Failures", "code": 200, "details": [ { "type": "DB Error", "message": "The following chunk of rows could not be inserted due to faulty data.", "rows": "452 to 1000", "failureSource": [ "Garold McCloughlin", "gmccloughlinqy@mediafire.com", "81680 Di Loreto Park", null, "2021-10-28T15:58:00.000Z", "Hi Garold McCloughlin," ] } ] }`

  OR

  - **Code:** 400 <br />
    **Content:** `{ "statusCode": 400, "message": "Only CSV files are allowed!", "error": "Bad Request" }`

- **Sample Call:**

  ```
  http://localhost:8080/import-customers
  ```
