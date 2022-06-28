
# Project Title
Book Comet:This project contains backend API made on NOdejs and we have used JSON file instead database and nodejs fs module to read and write from database.

We have also created frontend application for it on Angular and it can be clone from [https://github.com/ritik-ongraph/book-comet-frontend.git]



## Run Locally

Clone the project

```bash
  git clone https://github.com/ritik-ongraph/book-comet-api
```

Go to the project directory

```bash
  cd book-comet-api
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node app.js
```
you can also use nodemon
```bash
  npm start
```

## Recomended Node Version
```
node v16.15.1
```





## API Reference

#### Get all items

```http
  GET /api/v1/books
```
It returns all the books

#### Get item

```http
  GET /api/v1/books{id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |



#### Get Book By Book Name and Book Id

```http
GET /api/v1/books/id/{id}/name/{name}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |
| `name`    | `string` |  **Required**. Name of item to fetch

### Get Book by Author and Publisher
```http
GET /api/v1/books/id/{id}/name/{name}
```
| Parameter   | Type     | Description                                 |
| :--------   | :------- | :--------------------------------           |
| `author`    | `string` | **Required**. author of item to fetch       |
| `publisher` | `string` |  **Required**. publisher of item to fetch   | 


### Get Book By Searchterm

```http
GET /api/v1/books/searchterm/
```

| Query String Parameter   | Type     | Description                                 |
| :--------   | :------- | :--------------------------------           |
|`id`         | `string` | **optional**. ID of item to fetch           |
| `name`      | `string` | **optional**  Name of item to fetch         |
| `author`    | `string` | **optional**. author of item to fetch       |
| `publisher` | `string` |  **optional**. publisher of item to fetch   | 

### Get Book By Id

```http
GET /api/v1/books/{id}
```


| Query String Parameter   | Type     | Description                                 |
| :--------   | :------- | :--------------------------------           |
|`id`         | `string` | **Required**. ID of item to fetch           |




