/** @format */

import mongoose from 'mongoose';
import config from './app/config';
import app from './app';
import { Server } from 'http';

let server:  Server

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('Database connected successfully!');

    console.log('Starting server...');

   server = app.listen(config.port, () => {
      console.log(` app listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();


process.on('unhandledRejection', ()=> {
  console.log('unhandled rejection is detected , shutting down the server...');
  if(server) {
    server.close(()=> {
      process.exit(1)
    })
  }

  process.exit(1);
});


process.on('uncaughtException', ()=> {
  console.log('uncaught exception is detected , shutting down the server');
  process.exit(1)
})

