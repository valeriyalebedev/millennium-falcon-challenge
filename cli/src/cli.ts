#!/usr/bin/env node

import path from "path"
import fs from 'fs';
import { loadRouteMap } from 'core';
import { MilleniumFalconConfig } from 'core';
import { loadBountyHunters } from 'core';
import { computeOdds } from 'core';
import { validateEmpireConfig } from 'core';
import { validateMilenniumFalconConfig } from 'core';
import { EmpireConfig } from "core";

const args = process.argv.slice(2)

if(args.includes('--help') || args.includes('-h')){
    console.log(`\n
     Description: give-me-the-odds CLI tool takes two file paths as arguments and prints the probability of success
     of the Millennium Falcon to reach its destination before the Empire's countdown ends and save the galaxy.
     
     Arguments: 
     
     First file is the Millennium Falcon configuration JSON file, 
     containing the autonomy, the path towards an SQLite database file containing all the routes, 
     the name of the planet where the Millennium Falcon is currently parked and the name of the planet that the empire wants to destroy.

     Example: {
        "autonomy": 6,
        "departure": "Tatooine",
        "arrival": "Endor",
        "routes_db": "universe.db"
      }

      Second file is the Empire data JSON file,
      containing the data intercepted by the rebels about the plans of the Empire and displaying the odds (as a percentage) that the Millennium Falcon reaches Endor in time and saves the galaxy.

      Example: {
        "countdown": 6, 
        "bounty_hunters": [
          {"planet": "Tatooine", "day": 4 },
          {"planet": "Dagobah", "day": 5 }
        ]
      }

     Usage: give-me-the-odds <millenium-falcon.json> <empire.json>\n
     Example: give-me-the-odds examples/example3/millennium-falcon.json examples/example3/empire.json
    `);
    process.exit(0);
}
if(args.length !== 2 && (!args.includes('--help') || !args.includes('-h'))){
    console.error(`Please provide exactly two arguments: <millenium-falcon.json> <empire.json>
    For more information please run give-me-the-odds --help to see usage \n
    `)
    process.exit(1)
}

//Resolving file paths
const falconFile = path.resolve(args[0]!);
const empireFile = path.resolve(args[1]!);

function assertFileExists(filePath: string){
    if(!fs.existsSync(filePath)){
        console.error(`File not found: ${filePath} please check the path and try again.\n`);
        process.exit(1);
    }
}
assertFileExists(falconFile);
assertFileExists(empireFile);


//Reading JSON files 
const milleniumFalconConfigRaw = JSON.parse(fs.readFileSync(falconFile, "utf-8")) as MilleniumFalconConfig;
const empireDataRaw = JSON.parse(fs.readFileSync(empireFile, "utf-8"));

let empireData : EmpireConfig;
let milleniumFalconConfig: MilleniumFalconConfig;
//Validating configurations
try{
    empireData = validateEmpireConfig(empireDataRaw);
    milleniumFalconConfig = validateMilenniumFalconConfig(milleniumFalconConfigRaw);
}catch(err){
    console.error((err as Error).message + "\n");
    process.exit(1);
}

//Loading route map
const routesDBPath = path.resolve(path.dirname(falconFile), milleniumFalconConfig.routes_db);

const routes = loadRouteMap(routesDBPath);

const bountyHunters = loadBountyHunters(empireData.bounty_hunters);
const countDown = empireData.countdown;

//Calculate odds
const odds = computeOdds(
    routes,
    milleniumFalconConfig.autonomy,
    bountyHunters,
    milleniumFalconConfig.departure,
    milleniumFalconConfig.arrival,
    countDown
)

console.log(odds + "\n")


