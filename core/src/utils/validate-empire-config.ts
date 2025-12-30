import { EmpireConfig } from "../models/empire-config.model.js";

export function validateEmpireConfig(data:unknown) : EmpireConfig{
    const obj = data as any;

    if(typeof obj !== "object" || obj === null){
        throw new Error("Invalid EmpireConfig: not an object");
    }

    if(typeof obj.countdown !== "number" || obj.countdown < 0){
        throw new Error("Invalid EmpireConfig: countdown must be a non-negative number");
    }

    if(!Array.isArray(obj.bounty_hunters)){
        throw new Error("Invalid EmpireConfig: bounty_hunters must be an array");
    }

    return obj as EmpireConfig;
}