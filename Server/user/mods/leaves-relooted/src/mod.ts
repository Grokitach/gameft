import { DependencyContainer } from "tsyringe";

import { Ilogger } from "@spt-aki/models/spt/utils/Ilogger";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ILocationConfig } from "@spt-aki/models/spt/config/ILocationConfig";
import { ILootConfig } from "@spt-aki/models/spt/config/ILootConfig";

//Mod setup
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";
import { VFS } from "@spt-aki/utils/VFS";

import { jsonc } from "jsonc";
import * as path from "path";


class ReLooted implements IPostDBLoadMod
{
    private logger: Ilogger;

    private db: DatabaseServer;
    private cfgServer: ConfigServer;
    private locConfig: ILocationConfig;
    private lootConfig: ILootConfig;

    //Config
    private config;
    private vfs;
    private shorelineKeycardsJson = require( "../assets/shorelineKeycards.json" );
    private streetsbloodykey = require( "../assets/streetsbloodykey.json" );

    public postDBLoad ( container: DependencyContainer ): void
    {

        this.vfs = container.resolve<VFS>( "VFS" );
        const configFile = path.resolve( __dirname, "../config/config.jsonc" );
        this.config = jsonc.parse( this.vfs.readFile( configFile ) );

        // Get stuff from the server container.
        this.logger = container.resolve<Ilogger>( "WinstonLogger" );

        // Get database from server.
        this.db = container.resolve<DatabaseServer>( "DatabaseServer" );
        this.cfgServer = container.resolve<ConfigServer>( "ConfigServer" );
        this.locConfig = this.cfgServer.getConfig( ConfigTypes.LOCATION );
        this.lootConfig = this.cfgServer.getConfig( ConfigTypes.LOOT );

        const mapNames = [
            "bigmap",
            "factory4_day",
            "factory4_night",
            "interchange",
            "laboratory",
            "lighthouse",
            "rezervbase",
            "woods"
        ]

        let locations = this.db.getTables().locations;

        this.printColor( "[ReLooted] Starting! Greetings from Leaves!", LogTextColor.GREEN );
        this.printColor( "[ReLooted] FYI: This mod should be loaded as early as possible to maximize compatibility.", LogTextColor.CYAN );


        if ( this.config.unfuckGivingTreeKeycardSpawns )
        {
            this.printColor( "[ReLooted]\t Fixing Giving Tree Keyspawn chances", LogTextColor.YELLOW );

            for ( let point of this.lootConfig.looseLoot[ "bigmap" ] )
            {
                if ( point.template.Id == "Loot 19 (9)3856272" || point.template.Id == "Loot 19 (8)3860542" )
                {
                    point.probability = this.config.givingTreeKeySpawnChance;
                }
            }
        }



        for ( let map of mapNames )
        {
            this.printColor( "[ReLooted]\t loading data for: " + map, LogTextColor.YELLOW );
            const newData = require( "../assets/" + map );

            this.printColor( "[ReLooted]\t Injecting new data for " + map, LogTextColor.YELLOW );
            locations[ map ].looseLoot.spawnpoints = newData.spawnpoints;

            if ( this.config.changeSpawnPointCount )
            {
                locations[ map ].looseLoot.spawnpointCount = newData.spawnpointCount;
            }
        }

        if ( this.config.shorelineKeycards )
        {
            this.lootConfig.looseLoot[ "shoreline" ] = this.shorelineKeycardsJson.shoreline;
            this.printColor( "[ReLooted]\t Injecting keycard spawns to shoreline", LogTextColor.YELLOW );
        }

        if ( this.config.setLootMultipliersToOne )
        {
            this.printColor( "[ReLooted]\t Setting looseLootMultiplier for all locations to 1.", LogTextColor.YELLOW );
            this.printColor( "[ReLooted]\t Keep in mind that mods like SVM might override this. ", LogTextColor.YELLOW );
            for ( let multi in this.locConfig.looseLootMultiplier )
            {
                this.locConfig.looseLootMultiplier[ multi ] = 1;
            }
        }

        if ( this.config.streetsbloodykey )
        {
            this.printColor( "[ReLooted]\t Injecting new bloody key loot", LogTextColor.YELLOW );
            for( const point of this.streetsbloodykey )
            {
                point.probability *= this.config.streetsbloodykeyProbabilityMultiplier;
                locations[ "tarkovstreets" ].looseLoot.spawnpoints.push( point );
            }
            
        }
    }

    private debugJsonOutput ( jsonObject: any, label: string = "" )
    {

        if ( label.length > 0 )
        {
            this.logger.logWithColor( "[" + label + "]", LogTextColor.GREEN );
        }
        this.logger.logWithColor( JSON.stringify( jsonObject, null, 4 ), LogTextColor.MAGENTA );
    }

    private printColor ( message: string, color: LogTextColor = LogTextColor.GREEN )
    {
        this.logger.logWithColor( message, color );
    }
}

module.exports = { mod: new ReLooted() }