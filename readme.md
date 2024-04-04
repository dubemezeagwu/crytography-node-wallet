## Cryptography Node Wallet

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about distributed consensus for this project.

However, something that we would like to incorporate is Public Key Cryptography using Ethereum. By using Elliptic Curve Digital Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the associated address. 

This is a demo-project submission for the Alchemy University Ethereum Developer Bootcamp

#### Packages used
- React
- Express
- Ethereum Cryptography
- Axios

### Video instructions
For an overview of this project as well as getting started instructions, check out the following [video]: 
(https://www.loom.com/share/786ed8ac2a394fcb9206e8276a391a8f?sid=95413b01-77f6-43ce-9007-3f3800089cf9)

 
### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the dependencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5042/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the dependencies 
3. Run `node index` to start the server
* You can automatically restart the server using [nodemon](https://www.npmjs.com/package/nodemon) instead of `node`

The application should connect to the default server port (5042) automatically! 

