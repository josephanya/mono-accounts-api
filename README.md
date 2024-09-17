# mono-accounts-api

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **MongoDB** (either locally installed or using a cloud service like MongoDB Atlas)
- **TypeScript** (installed globally or as a project dependency)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/josephanya/mono-accounts-api.git
   cd mono-accounts-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Configuration

1. **Create a `.env` file** in the root of the project directory:
   ```bash
   touch .env
   ```

2. **Add the following environment variables** to the `.env` file:
   ```env
   PORT = 3000  # The port on which the server will run
   DB_URL = mongodb://localhost:27017/bankdb   # MongoDB connection string
   AUTH_SECRET = your_secret_key   # Secret key for JWT authentication
   ```

   Replace `your_secret_key` with a strong secret key for token signing.

## Running the Application

1. **Compile TypeScript to JavaScript**:
   ```bash
   npx tsc
   ```

2. **Run the application**:
   ```bash
   node dist/server.js
   ```

3. Alternatively, you can use `ts-node` to run the application directly without compiling:
   ```bash
   npx ts-node server.ts
   ```

4. **Access the API**: Open your browser or use a tool like Postman to access the API at:
   ```
   http://localhost:3000
   ```

## Testing

1. **Run tests** using Jest
   ```bash
   npm test
   ```

## Additional Information

- Ensure that MongoDB is running before starting the application.
- Use Postman or curl to test the API endpoints.