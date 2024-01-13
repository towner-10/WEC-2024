const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Function to insert data into the database
async function insertData(data) {

  // Register unregistered disaster types 
  await prisma.disasterType.upsert({
    create: {
      typeName: data['type']
    },
    update: {
      typeName: data['type']
    },
    where: { typeName: data['type'] }
  });

  // Get the disasterType
  const disasterType = await prisma.disasterType.findFirst({
    where: {
      typeName: data['type'],
    },
  });

  let formattedDate = data['date'].split("/")
  formattedDate = formattedDate[2] +
    "-" + (formattedDate[0].length < 2 ? "0" : "") + formattedDate[0] +
    "-" + (formattedDate[1].length < 2 ? "0" : "") + formattedDate[1]
  formattedDate = formattedDate + "T00:00:00.000Z";

  // Insert the disaster into the table
  await prisma.disaster.create({
    data: {
      name: data['Name'],
      longitude: Number.parseFloat(data['long']),
      latitude: Number.parseFloat(data['lat']),
      date: formattedDate,
      intensity: Number.parseInt(data['intensity']),
      dType: {
        connect: {
          typeName: disasterType.typeName,
        }
      }
    }
  });
}

// Check if the database file exists
if (fs.existsSync('./prisma/data.db')) {
  // After the command is executed, read the CSV file and insert the data into the database
  fs.createReadStream('./resources/MOCK_DATA.csv')
    .pipe(csv())
    .on('data', async (row) => {
      await insertData(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
} else {
  console.log("Database file not found. Please run `npm run db:generate` and `npm run db:migrate` to generate the database file.");
}