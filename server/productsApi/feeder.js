const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function etlProcess(filePath, modelName) {
  try {
    const batchSize = 100;
    let batch = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const transformedRow = {};

        for (const key in row) {
          if (Object.hasOwnProperty.call(row, key)) {
            transformedRow[key] = row[key];
          }
        }

        batch.push(transformedRow);

        if (batch.length === batchSize) {
          console.log('Adding batch.');
          prisma[modelName].createMany({
            data: batch,
            skipDuplicates: true,
          })
            .catch((error) => {
              console.error('Error during batch insert:', error);
            });

          batch = [];
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          prisma[modelName].createMany({
            data: batch,
            skipDuplicates: true,
          })
            .catch((error) => {
              console.error('Error during final batch insert:', error);
            });
        }

        console.log('ETL process completed.');
        process.exit(0);
      });
  } catch (error) {
    console.error('Error during ETL process:', error);
    process.exit(1);
  }
}

module.exports = {
  etlProcess,
};