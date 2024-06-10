import { DependencyContainer } from "tsyringe";

import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { TimeUtil } from "@spt-aki/utils/TimeUtil";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { VFS } from "@spt-aki/utils/VFS"

import { jsonc } from "jsonc";
import * as path from "path";

//Location
import { LocationController } from "@spt-aki/controllers/LocationController";
import { IGetLocationRequestData } from "@spt-aki/models/eft/location/IGetLocationRequestData";
import { ILocationBase } from "@spt-aki/models/eft/common/ILocationBase";

//Mod setup
import { OnLoadModService } from "@spt-aki/services/mod/onLoad/OnLoadModService";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";

class LootFuckery implements IPostDBLoadMod, IPreAkiLoadMod
{
    private logger: ILogger;
    private jsonUtil: JsonUtil;
    private timeUtil: TimeUtil;
    private vfs: VFS;
    private outputFolder: string;

    //For the actual run hook.
    private actualRun = false;
    private actualRunData: any;

    private db: DatabaseServer;
    private locationControl: LocationController;

    //Config
    private config: any;
    private lootConfig: any;

    public postDBLoad ( container: DependencyContainer ): void
    {
        // Get stuff from the server container.
        this.logger = container.resolve<ILogger>( "WinstonLogger" );
        this.jsonUtil = container.resolve<JsonUtil>( "JsonUtil" );
        this.timeUtil = container.resolve<TimeUtil>( "TimeUtil" );


        // Get database from server.
        this.db = container.resolve<DatabaseServer>( "DatabaseServer" );

        // get output directory for generated files
        // "Leaves-LootFuckery" is the directory name of the mod
        const preAkiModLoader = container.resolve<PreAkiModLoader>( "PreAkiModLoader" );
        this.outputFolder = preAkiModLoader.getModPath( "Leaves-LootFuckery" ) + "output/";

        this.locationControl = container.resolve<LocationController>( "LocationController" );
    }

    public preAkiLoad ( container: DependencyContainer ): void
    {
        const logger = container.resolve<ILogger>( "WinstonLogger" );
        const onLoadModService = container.resolve<OnLoadModService>( "OnLoadModService" );

        this.vfs = container.resolve<VFS>( "VFS" );

        const configFile = path.resolve( __dirname, "../config/config.jsonc" );
        this.config = jsonc.parse( this.vfs.readFile( configFile ) );

        const lootFile = path.resolve( __dirname, "../config/loot.jsonc" );
        this.lootConfig = jsonc.parse( this.vfs.readFile( lootFile ) );

        // run mod logic _after_ all mods have resolved
        onLoadModService.registerOnLoad
            (
                //No idea what this all means. I blame chomp.
                "LootFuckery-mod", // route key
                () => this.OnLoad( logger ),
                () => "LootFuckery" // new route name
            );
        if ( this.config.dataDumpRealRuns )
        {
            container.afterResolution( "LocationController", ( _t, result: LocationController ) => 
            {
                // We want to replace the original method logic with something different
                result.get = ( sessionId: string, request: IGetLocationRequestData ) => 
                {
                    return this.overrideGet( sessionId, request );
                }
                // The modifier Always makes sure this replacement method is ALWAYS replaced
            }, { frequency: "Always" } );
        }
    }

    private overrideGet ( sessionId: string, request: IGetLocationRequestData, calledByMod = false ): ILocationBase 
    {
        //Original code 
        this.logger.debug( `Generating data for: ${ request.locationId }, variant: ${ request.variantId }` );
        const name = request.locationId.toLowerCase().replace( " ", "" );

        this.actualRunData = this.locationControl.generate( name );

        if ( !calledByMod )
        {
            this.actualRun = true;

            //Do stuff
            this.generateMap( name + "_actual_run" );

            this.actualRun = false;
        }

        return this.actualRunData;
    }

    //leaves edition lmao. Hackiest shit on the planet. 
    // dict: ["string"]: { "total": number, "max": number }
    private sortDataByValue ( dict: any ): any
    {
        /* conversion from dict to jagged arrays with invariance
           dict: ["string"]: { "total": number, "max": number }
           arr:  [ ["string", { "total": number, "max": number }], ... ]
        */
        let items = [];

        for ( const key in dict )
        {
            const item = dict[ key ];
            items.push( [ key, item ] );
        }

        // Sort the array based on the second element
        items.sort( ( first, second ) =>
        {
            return second[ 1 ].total - first[ 1 ].total;
        } );

        //The sort and arrayify leaves the data stored in an array of arrays. Each sub-array is 2 elements long, the first element is the ID string. 
        //the second element is an object with two data points. total, and max

        let fixed = {};
        for ( const item of items )
        {
            // item[0] is ID
            //      item[1].max
            //      item[1].total 

            let data = { total: item[ 1 ].total, max: item[ 1 ].max }

            fixed[ item[ 0 ] ] = data;
        }

        return fixed;
    }

    private writeResult ( prefix: string, data: any, extension: string = ".json" ): void
    {
        // get formatted text to save
        const text = ( this.config.convertToCompact )
            ? this.jsonToText( data )
            : this.jsonUtil.serialize( data, true );

        // get file name
        const date = this.timeUtil.getDate();
        const time = this.timeUtil.getTime();
        const fileName = this.outputFolder + prefix + "_" + date + "_" + time + extension;

        // save file
        this.vfs.writeFile( fileName, text );
        this.logger.info( "Written results to: " + fileName );
    }

    public OnLoad ( logger: ILogger ): void
    {
        this.printColor( "[LootFuckery] LootFuckery Starting:" );

        if ( !this.db )
        {
            this.logger.error( "db not initialized. ??" )
            return;
        }

        if ( this.config.editProbabilities )
        {
            this.editProbabilities();
        }

        if ( this.config.dataDump )
        {
            if ( this.config.runAllMaps )
            {
                const locationNames = this.getLocationNames();

                for ( const locationName of locationNames )
                {
                    this.generateMap( locationName );
                }
            }
            else
            {
                this.generateMap( this.config.mapToGenerate );
            }
        }
    }

    private generateLoot ( map: string ): any
    {
        const accountID = "DOESNT MATTER IN 3.7.1";
        const request: IGetLocationRequestData =
        {
            crc: 0,
            locationId: map,
            variantId: 1
        }

        //return this.locationControl.get( accountID, request );
        return this.overrideGet( accountID, request, true );
    }

    private getProbability ( item: string, map: string ): number
    {
        const itemTable = this.db.getTables().templates.items;

        const globalCategories = this.lootConfig.globalCategories;
        const globalItems = this.lootConfig.globalItems;
        const mapCategories = this.lootConfig.mapSpecific[ map ].categories;
        const mapItems = this.lootConfig.mapSpecific[ map ].items;

        const parent = itemTable[ item ]._parent;

        //Check if it has a map specific item entry.
        if ( mapItems[ item ] )
        {
            return mapItems[ item ].multi;
        }

        //Check if we have a global item entry.
        if ( globalItems[ item ] )
        {
            return globalItems[ item ].multi;
        }

        //Check if we have a map specific category entry
        if ( mapCategories[ parent ] )
        {
            return mapCategories[ parent ].multi;
        }

        //Check if we have a global category
        if ( globalCategories[ parent ] )
        {
            return globalCategories[ parent ].multi;
        }

        //oh fuck
        this.printColor( `[LootFuckery] Found item without matching parent: ${ item } - Parent: ${ itemTable[ parent ]._name } -ID: ${ parent }`, LogTextColor.RED );

        return 0;
    }

    private adjustPoint ( point: any, map: string ): void
    {

        const itemTable = this.db.getTables().templates.items;
        const items = point.template.Items;
        let relativeID = 0;
        let runningMulti = 0;

        const globalCategories = this.lootConfig.globalCategories;

        for ( const item in point.template.Items )
        {
            //If an entry has a parent, it's not the top node in the entry. So we skip it.
            if ( items[ item ].parentId )
            {
                continue;
            }

            const multi = this.getProbability( items[ item ]._tpl, map )
            runningMulti += multi;

            const probability = Math.ceil( point.itemDistribution[ relativeID ].relativeProbability * 100 * multi );
            point.itemDistribution[ relativeID ].relativeProbability = probability;

            relativeID++;
        }

        //Get the total average multiplier. maxxed at 0.99, because at 1 it will get forced spawned and not count for max loot spawns. Go figure.
        const avgMulti = runningMulti / relativeID;

        point.probability *= avgMulti;

        if ( point.probability >= 1 )
        {
            point.probability = 0.99;
        }
    }

    private categorize ( lootTable: any ): any 
    {
        let categoryTable = {};


        const tables = this.db.getTables();
        const locale = tables.locales.global[ this.config.localization ];
        const items = tables.templates.items;

        if ( !locale )
        {
            this.printColor( "[LootFuckery]: Localization: \"" + this.config.localization + "\" does not exist! Exiting!", LogTextColor.RED );
            return;
        }

        for ( const item in lootTable )
        {

            if ( items[ item ]._parent )
            {
                if ( !categoryTable[ items[ item ]._parent ] )
                {
                    categoryTable[ items[ item ]._parent ] = [];
                }

                let temp = {};
                if ( this.config.convertToName )
                {
                    const name = this.config.localizeNames
                        ? locale[ item + " Name" ]
                        : items[ item ]._name;

                    temp[ name ] = lootTable[ item ];
                }
                else
                {
                    temp[ item ] = lootTable[ item ];
                }

                categoryTable[ items[ item ]._parent ].push( temp );
            }
        }

        return categoryTable;
    }

    private generateRuns ( mapToGenerate: string ): any
    {
        let lootTable = {};

        let currentRun = {};

        for ( let i = 0; i < this.config.timesToGenerate; i++ )
        {
            currentRun = {};

            const generatedLoot = this.actualRun ?
                this.actualRunData :
                this.generateLoot( mapToGenerate );

            this.printColor( `[LootFuckery] \tCurrent Generation Count: ${ i + 1 }`, LogTextColor.MAGENTA );
            for ( const point of generatedLoot.Loot )
            {
                if ( point.IsContainer )
                {
                    continue;
                }

                const templateID = point.Items[ 0 ]._tpl;

                if ( !currentRun[ templateID ] )
                {
                    currentRun[ templateID ] = 0;
                }

                currentRun[ templateID ]++;
            }

            this.AddTableValues( lootTable, currentRun );

            if ( this.actualRun )
            {
                return lootTable;
            }
        }

        return lootTable;
    }

    // a: ["string"]: { "total": number, "max": number }
    // b: ["string"]: number
    // note: we're modifying a directly (pass by reference)
    private AddTableValues ( a: any, b: any )
    {
        const keys = Object.keys( b );

        for ( const key of keys )
        {
            if ( !a[ key ] )
            {
                // key doesn't exist, so let's make a new entry that uses B's values
                a[ key ] = {
                    total: b[ key ],
                    max: b[ key ]
                };
            }
            else
            {
                // add b to total
                a[ key ].total += b[ key ];

                // set max to b if max is smaller than b
                if ( a[ key ].max < b[ key ] )
                {
                    a[ key ].max = b[ key ];
                }
            }
        }
    }

    private generateMap ( mapToGenerate: string ): void
    {
        if ( this.actualRun )
        {
            this.printColor( "[LootFuckery] Dumping Run", LogTextColor.YELLOW );
        }
        else
        {
            this.printColor( "[LootFuckery] Generating Run(s)", LogTextColor.YELLOW );
        }
        const tables = this.db.getTables();

        const items = tables.templates.items;

        let lootTable = this.generateRuns( mapToGenerate );

        //Sort the output
        lootTable = this.sortDataByValue( lootTable );

        if ( this.config.categorize )
        {
            lootTable = this.categorize( lootTable );
        }

        if ( this.config.convertToName )
        {
            let prettyTable = {};

            for ( const item in lootTable )
            {
                const name = items[ item ]._name;

                prettyTable[ name ] = lootTable[ item ];
            }

            lootTable = prettyTable;
        }

        this.writeResult( "loot_" + mapToGenerate + "_-", lootTable );
    }

    private editProbabilities (): void
    {
        const tables = this.db.getTables();

        const locationNames = this.getLocationNames();

        this.printColor( "[LootFuckery] Editing Loot Probabilities\n-----------------------", LogTextColor.CYAN );

        for ( const locationName of locationNames )
        {
            this.printColor( "[LootFuckery] Adjusting: " + locationName, LogTextColor.YELLOW );

            const location = tables.locations[ locationName ];
            location.looseLoot.spawnpointCount.mean *= this.lootConfig.mapSpecific[ locationName ].totalLootMultiplier;

            const spawnPoints = location.looseLoot.spawnpoints;
            for ( const point of spawnPoints )
            {
                this.adjustPoint( point, locationName );
            }

        }
    }

    private getLocationNames (): string[]
    {
        let locationNames = [];
        const locations = this.db.getTables().locations;

        for ( const locationName in locations )
        {
            const location = locations[ locationName ];

            if ( location.looseLoot !== undefined )
            {
                locationNames.push( location.base.Id.toLowerCase() );
            }
        }

        return locationNames;
    }

    private getItemFormatted ( id: string, value: any ): string
    {
        let total = value.total;
        let avg = value.total / this.config.timesToGenerate;
        let max = value.max;

        if ( this.actualRun )
        {
            return "\"" + id + "\": Total:" + total;
        }
        return "\"" + id + "\": Avg:" + avg + " | Max:" + max;
    }

    private jsonToText ( json: any ): string
    {
        const space = ' ';
        const nl = '\n';
        const tab1 = space + space + space + space;
        const tab2 = tab1 + tab1;

        let text = "";
        for ( const ID in json )
        {
            if ( this.config.categorize )
            {
                // ID: category
                // json[ID]: an array of { itemID: value }

                text += tab1 + "[" + ID + "]" + nl;

                for ( const entry of json[ ID ] )
                {
                    const itemID = Object.keys( entry )[ 0 ];
                    const entryText = this.getItemFormatted( itemID, entry[ itemID ] );
                    text += tab2 + entryText + nl;
                }
            }
            else
            {
                // ID: itemid
                // json[ID]: value

                text += this.getItemFormatted( ID, json[ ID ] ) + nl;
            }
        }

        return text;
    }

    private debugJsonOutput ( jsonObject: any, label: string = "" )
    {
        //if ( this.config.debug )
        //{
        if ( label.length > 0 )
        {
            this.logger.logWithColor( "[" + label + "]", LogTextColor.GREEN );
        }
        this.logger.logWithColor( JSON.stringify( jsonObject, null, 4 ), LogTextColor.MAGENTA );
        //}
    }
    private printColor ( message: string, color: LogTextColor = LogTextColor.GREEN )
    {
        this.logger.logWithColor( message, color );
    }
}

module.exports = { mod: new LootFuckery() }