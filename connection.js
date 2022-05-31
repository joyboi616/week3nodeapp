// Conection
const { MongoClient } = require ('mongodb');

async function main() {
  const uri = "mongodb+srv://StebanPls:Contrasena@cluster0.yoay7.mongodb.net/?retryWrites=true&w=majority";

  const client = new MongoClient(uri, {useUnifiedTopology: true});

  try {
    await client.connect();

    // to see all dbs in the cluster
    await listDatabases(client);

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
    }
}

//main
main().catch(console.error);

//Function list databases
async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();

  console.log("Databases: ");
  databasesList.databases.forEach(db => {
    console.log(`- ${db.name}`);
  })
}