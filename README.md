## Reviewer Notes

- most of frontend problems in because you maybe didnot start the api that provides images for the gallery make sure to start 2 servers toghether
- add error on .png images upload
- fixed eslint and prettier
- i cant perform tests on my function because it doesnot take any parameters so it is tested by a request

# Dynamic Image Uploader and Resizer

This project provides placeholder image generation with resizing capabilities via a REST API.

## Used Technologies

### Back End

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [cors](https://www.npmjs.com/package/cors)
- [multer](https://www.npmjs.com/package/multer)
- [sharp](https://sharp.pixelplumbing.com/)

### Front End

- [npm](https://www.npmjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

### Testing

- [Jasmine](https://jasmine.github.io/)
- [Supertest](https://www.npmjs.com/package/supertest)

### Code Quality

- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## How to install

### 1. Clone the Repository

```bash
git clone https://github.com/Mo-Ghobashy/Dynamic-Image-Uploader-and-Resizer.git

```

### 2. Navigate to the server directory

```bash
cd Dynamic-Image-Uploader-and-Resizer/server
```

### 3. Install backend dependencies

```bash
npm install
```

### 4. Build the backend TypeScript code

```bash
npm run build
```

### 5. Start the backend server

```bash
npm run start
```

### 6. Tests

Run

```bash
npm run test
```

### 7. Navigate to the client directory

```bash
cd ../client
```

### 8. Install frontend dependencies

```bash
npm install
```

### 9. Start the frontend

Open client/index.html with Live Server extension in VSCode
or

Open the index.html file manually in your browser.

## How to Use

### How to get a placeholder img link in the Front-End?

Click on the resize button under the img you want from the gallery add the needed height and width then the url will appear

### How to upload a new img to the gallery?

Using the upload form select an img from your device and click submit button

### how to access a specific img with desired height and width from the API?

Write the fileName as a param and height,width as queries

#### for instance:

```bash
http://localhost:3000/images/fjord.jpg?height=1000&width=500
```

## Folder Structure

### Why use 2 separate directories?

This project uses 2 separate Servers for Back-End/Front-End so it is scailable as possible

#### - `/server` → Express backend

Main file is index.ts

Folders:

- routes → contains routers
- controlers → contains all main functions which runs in routers
- utils → contains schema for different operations
- middleware → contains middlewares

#### - `/client` → Frontend files

## Features

- Upload image
- Resize Image
- Return Url
- Storing images
- Chaching repeated Requests

## Endpoints

```ruby
POST /images/upload
- Uploads an image.

GET /images/:filename
- Fetches an uploaded image.

GET /images/resize/:filename?height=xx&width=xx
- Resizes an uploaded image to given dimensions.
```

## Functionality Explaination

### Back-End

### Controller

- resizeImg → returns file with given height and width
  logic: recieves queries and params from the endpoint → make path for the img to access it in the images/full dir and another for images/thumb → check if the file exists or not → check if there is height and width params → if the img with the same name and size it will be returned(caching) → if all ok it resizes the img with sharp and return it.
  -uploadImg → this is the function which is being handled after the upload
  getAllImages → returns a json file with all image names in tha gallery

### middleware

- asynWrapper → wraps all async functions to catch errors if existed and pass it to error handling middleware
- upload → uses multer to upload images in the images/full dir input type must be an img

### tests

- indexSpec → tests endpoints with right and wrong calls

### Front-End

- Using fetch to get all image names from image-list endpoint and showing them in the page
- createUrl → Creates a url to access the img using given height,width,fileName which takes its value from using shadowing in openResizeForm

## License

This project is for educational purposes.
