#!/usr/bin/env node

import path from "path"
import fs from 'fs';
import { loadRouteMap } from 'core';
import type { MilleniumFalconConfig } from 'core';
import { loadBountyHunters } from 'core';
import { computeOdds } from 'core';

const args = process.argv.slice(2)
if(args.length !== 2){
    console.error("Please provide exactly two arguments: <millenium-falcon.json> <empire.json>")
    process.exit(1)
}

const falconFile = path.resolve(args[0]!);
const empireFile = path.resolve(args[1]!);


//Reading JSON files 
const milleniumFalconConfig = JSON.parse(fs.readFileSync(falconFile, "utf-8")) as MilleniumFalconConfig;
const empireData = JSON.parse(fs.readFileSync(empireFile, "utf-8"));

//Loading route map
const routes = loadRouteMap(milleniumFalconConfig.routes_db);

const bountyHunters = loadBountyHunters(empireData);
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

console.log(odds)


