const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();
const { etlProcess } = require('./feeder.js');

async function main() {
  try {
    await prisma.$connect();
    console.log('Connected to the database.');
    await etlProcess('csvs/styles.csv', 'styles');
    await prisma.$disconnect();
    console.log('Disconnected from the database.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();