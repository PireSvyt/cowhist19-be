const fs = require("fs-extra")
const stream = require("stream");
const path = require ("path")

// 
const usersOrigin = require("./origin/test.users.json");
const tablesOrigin = require("./origin/test.tables.json");
const gamesOrigin = require("./origin/test.games.json");

// Service
//const { random_id, random_string } = require("../../src/resources/toolkit.js");

/*

DATA MODEL MIGRATION January 2024

This data model change comes from the following refactorings
  * use of "ITEMID" to benefit from tableid in game endpoints to grant access to table to perform operations
  * game model change with an array of contracts, containing the list of players, the contract and the outcome
  * multiple contracts are supported

Notes : 
  * This is the first migration operated and therefore might be sketchy and show weaknesses.
  * It obviously makes sense to perform a first time migration to learn how tedious and weak this can be
    with the intention to learn about operational challenges, and then to reflect on available tools.

*/

async function script() {
  // SCRIPT
  console.log("SCRIPT START");

  // MIGRATIONS DEFINITION --------------------------------------------------------------------------------------------
  console.log("\n> MIGRATION DEFINITION" + "\n");
  
  let migrations = []

  /*  0. add a schema reference to original data
          - schema : "original" as tag would be enough
  */
 
  // Users 
  migrations.push({
    name: "original",
    collections: ["users", "tables", "games"],
    mapping: (item) => {
      let mappedItem = {...item}
      // Mapping
      delete mappedItem.__v
      // Return 
      mappedItem.schema = "original"
      return mappedItem
    }
  })

  /*  1. the mapping of existing ids to ITEMIDs
          - the creation of ITEMID for all items
          - the update of existing reference id to ITEMID
          - schema : "itemids"
  */

  // Users 
  migrations.push({
    name: "itemids",
    collections: ["users"],
    mapping: (item) => {
      let mappedItem = {...item}
      // Mapping
      if (mappedItem.userid === undefined) {
        mappedItem.userid = mappedItem._id.$oid
      }
      delete mappedItem.id
      // Return 
      mappedItem.schema = "itemids"
      return mappedItem
    }
  })

  // Tables
  migrations.push({
    name: "itemids",
    collections: ["tables"],
    mapping: (item) => {
      let mappedItem = {...item}
      // Mapping
      if (mappedItem.tableid === undefined) {
        mappedItem.tableid = mappedItem._id.$oid
      }
      mappedItem.userids = mappedItem.users
      delete mappedItem.id
      delete mappedItem.users
      // Return 
      mappedItem.schema = "itemids"
      return mappedItem
    }
  })

  // Games
  migrations.push({
    name: "itemids",
    collections: ["games"],
    mapping: (item) => {
      let mappedItem = {...item}
      // Mapping
      if (mappedItem.gameid === undefined) {
        mappedItem.gameid = mappedItem._id.$oid
      }
      if (mappedItem.tableid === undefined) {
        mappedItem.tableid = mappedItem.table
      }
      delete mappedItem.id
      delete mappedItem.table
      // Return 
      mappedItem.schema = "itemids"
      return mappedItem
    }
  })

  /*  2. the mapping of existing games from a single contract to a multi contract schema
          - add contracts field
          - build the contract from object 
          - push contract in contracts
          - delete irrelevant fields
          - schema : "multicontracts"
  */

  // Games
  migrations.push({
    name: "multicontracts",
    collections: ["games"],
    mapping: (item) => {
      let mappedItem = {...item}
      // Mapping
      let players = []
      item.players.forEach(player => {
        players.push({
          userid: player._id,
          role: player.role
        })
      })
      let contract = {
        contract: item.contract,
        players: players,
        outcome: item.outcome
      }
      mappedItem.contracts = [ contract ]
      // Cleanup
      delete mappedItem.contract
      delete mappedItem.players
      delete mappedItem.outcome      
      // Return
      mappedItem.schema = "multicontracts"
      return mappedItem
    }
  })

  // MAPPING ----------------------------------------------------------------------------------------------------------
  console.log("\n> MAPPING" + "\n");
  applyMigrations(migrations)

  // DESTINATION EXPORT -----------------------------------------------------------------------------------------------
  console.log("\n> DESTINATION EXPORT" + "\n");
  exportCollections()

  
  console.log("\nSCRIPT END");
  
}

let state = {
  collections: ["users", "tables", "games"],
  origin: {
    users: usersOrigin,
    tables: tablesOrigin,
    games: gamesOrigin,
  },
  destination: {
    users: [],
    tables: [],
    games: [],
  },
};
script();

async function exportCollections() {
  try {                
    state.collections.forEach(async (collection) => {
      console.log("\n==> collection : " + collection);
      let collectionFileName = "destination." + collection + ".json"
      let collectionFileLoc = path.join(__dirname, "/destination/", collectionFileName)
      console.log("collectionFileLoc", collectionFileLoc)
      await fs.ensureFile(collectionFileLoc)
          .catch(err=>console.log)
      let collectionStream = fs.createWriteStream(collectionFileLoc,{encoding:'binary',flags : 'w'})
      let collectionBuffer = Buffer.from(JSON.stringify(state.destination[collection], undefined, 2))
      collectionStream.write(
        collectionBuffer, 'binary',
          //e=>console.log('script mapped object ' + fileName.split(".")[0] + ' in ' + objectFileName + '\n')
      )
    })
  } catch (error) {
      console.error(error);
      console.log("/!\\  exportCollections : ", error);
  }
}

async function applyMigrations(migrations) {

  state.collections.forEach((collection) => {
    console.log("\n==> collection : " + collection);
    if (state.origin[collection] !== undefined) {
      state.origin[collection].forEach((item) => {
        let migratedItem = { ...item };
        migrations
          .filter((migration) => {
            //console.log("migration", migration)
            return (migration.collections.filter((migrationCollection) => { return migrationCollection === collection}).length > 0 );
          })
          .forEach((migration) => {
            //console.log("    migration : " + migration.name);
            migratedItem = migration.mapping(migratedItem);
          });
        // Adding destination collection
        state.destination[collection].push(migratedItem);
      });
      // Comparison      
      console.log(
        "\n====> state.origin." + collection + "[0]" + "\n",
        state.origin[collection][0],
      );
      console.log(
        "\n====> state.destination." + collection + "[0]" + "\n",
        state.destination[collection][0],
      );
    }
  });
}