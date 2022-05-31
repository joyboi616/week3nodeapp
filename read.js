// Conection
const { MongoClient } = require ('mongodb');

async function main() {
  const uri = "mongodb+srv://StebanPls:Contrasena@cluster0.yoay7.mongodb.net/?retryWrites=true&w=majority";

  const client = new MongoClient(uri, {useUnifiedTopology: true});

  try {
    await client.connect();

    // to see all list databases in the cluster
    /* await listDatabases(client); */

    // Find One Listing
    /* await findOneListingByName(client, "Ribeira Charming Duplex"); */


    // Find multiple listings with different variables
    await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
      minimumNumberOfBedrooms: 4,
      minimumNumberOfBathrooms: 2,
      maximumNumberOfResults: 5
    });

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


// Function find one listing
async function findOneListingByName(client, nameOfListing) {
  const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name: nameOfListing});

  if (result) {
    console.log(`Found a listing in the collection with the name '${nameOfListing}'`);
    console.log(result);
  } else {
    console.log(`Nos listings in the collection with the name '${nameOfListing}'`);
  }
}

// Function find multiple listings with different variables
async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
  minimumNumberOfBedrooms = 0,
  minimumNumberOfBathrooms = 0,
  maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {
  const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find({
    bedrooms: {$gte: minimumNumberOfBedrooms},
    bathrooms: {$gte: minimumNumberOfBathrooms}
  }).sort({last_review: -1})
  .limit(maximumNumberOfResults);

    const results = await cursor.toArray();

    if (results.length > 0) {
      console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
      results.forEach((result, i) => {
        date = new Date(result.last_review).toDateString();

        console.log();
        console.log(`${i + 1}. name: ${result.name}`);
        console.log(`   _id: ${result._id}`);
        console.log(`   bedrooms: ${result.bedrooms}`);
        console.log(`   bathrooms: ${result.bathrooms}`);
        console.log(`   most recent review date: ${new Date(result.last_review).toDateString()}`);
      });
    } else {
        console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
    }
  }