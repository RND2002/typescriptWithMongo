# Node.js + TypeScript Guide

## Project Setup

### 1. Initialize the project
```sh
mkdir nodejs-typescript-guide
cd nodejs-typescript-guide
npm init -y
```

### 2. Install TypeScript
```sh
npm install --save-dev typescript
npx tsc --init
```

### 3. Update `tsconfig.json`
Replace the content of `tsconfig.json` with:
```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,  
    "strict": true,
    "skipLibCheck": true
  }
}
```

### 4. Install Express and Type Definitions
```sh
npm install express
npm install --save-dev @types/express @types/node
```

### 5. Create Project Structure
```sh
mkdir src
npx touch-cli src/server.ts
```

### 6. Update `package.json` scripts
Replace the `scripts` section with:
```json
"scripts": {
  "start": "node dist/server.js",
  "build": "tsc"
}
```

### 7. Run the Application
```sh
npm run build
npm start
```

## MongoDB Configuration
```sh
npm install mongoose
npm install --save-dev @types/mongoose
```

## Installing Additional TypeScript Dependencies
Use the following format to install dependencies with type definitions:
```sh
npm i --save-dev @types/cookie-parser