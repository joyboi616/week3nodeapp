// Conection
const { MongoClient } = require ('mongodb');

async function main() {
  const uri = "mongodb+srv://StebanPls:Contrasena@cluster0.yoay7.mongodb.net/?retryWrites=true&w=majority";

  const client = new MongoClient(uri, {useUnifiedTopology: true});

  try {
    await client.connect();

    // to see all list databases in the cluster
    /* await listDatabases(client); */


    // Delete a listing
    /* await deleteListingByName(client, "Cozy Cottage"); */

    // Delete a listing
    await deleteListingsScrapedBeforeDate(client, new Date("2019-02-15"));


  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
    }
}

//main
main().catch(console.error);


// Function list databases
async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();

  console.log("Databases: ");
  databasesList.databases.forEach(db => {
    console.log(`- ${db.name}`);
  })
}


// Delete listings by name
async function deleteListingByName(client, nameOfListing) {
  const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteOne({ name: nameOfListing });
  console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

// Delete listings before date
async function deleteListingsScrapedBeforeDate(client, date) {
  const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteMany({ "last_scraped": { $lt: date } });

  console.log(`${result.deletedCount} document(s) was/were deleted.`);
}