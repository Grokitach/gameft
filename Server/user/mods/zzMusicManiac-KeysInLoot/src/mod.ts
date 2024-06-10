import { DependencyContainer } from "tsyringe";
import { Ilogger } from "@spt-aki/models/spt/utils/Ilogger";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ItemHelper } from "@spt-aki/helpers/ItemHelper";
import { BaseClasses } from  "@spt-aki/models/enums/BaseClasses";

import { VFS } from "@spt-aki/utils/VFS";
import { jsonc } from "jsonc";
import path from "path";

class KeysInLoot implements IPostDBLoadMod
{
	private logger: Ilogger;
	public mod: string;
    public modShortName: string;

	constructor() {
        this.mod = "MusicManiac-KeysInLoot";
        this.modShortName = "KeysInLoot";
    }

	public postDBLoad ( container: DependencyContainer ): void 
	{
		this.logger = container.resolve<Ilogger>("WinstonLogger");
		const logger = this.logger;
		logger.info(`[${this.modShortName}] ${this.mod} started loading`);

		const itemHelper = container.resolve<ItemHelper>("ItemHelper");

		const db = container.resolve<DatabaseServer>("DatabaseServer");
		
		const vfs = container.resolve<VFS>("VFS");
		const config = jsonc.parse(vfs.readFile(path.resolve(__dirname, "../config.jsonc")));

		let tables = db.getTables();
		const itemDB = tables.templates.items;
		const jacket = tables.loot.staticLoot["578f8778245977358849a9b5"];
		const duffleBag = tables.loot.staticLoot["578f87a3245977356274f2cb"];
		const deadScav = tables.loot.staticLoot["5909e4b686f7747f5b744fa4"];
		const handbookPrices = tables.templates.handbook.Items;
		const fleaPrices = tables.templates.prices;
		let keys: string[] = [];
		let keyCards: string[] = [];

		for (let item in itemDB) {
			const itemId = itemDB[item]._id;;
			if (itemDB[item]._type == "Item") {
				if (itemHelper.isOfBaseclass(itemId, BaseClasses.KEY_MECHANICAL)) {
					//logger.info(`[${this.modShortName}] found mechanical key: ${itemId}`);
					keys.push(itemId);
					const itemToModify = handbookPrices.find(item => item.Id === itemId);
					if (itemToModify) {
						itemToModify.Price = Math.round(itemToModify.Price * config.keyTraderPricesMultiplier);
					}
					if (fleaPrices[itemId]) {
						fleaPrices[itemId] = Math.round(fleaPrices[itemId] * config.keyFleaPricesMultiplier);
					}				
				}
				if (itemHelper.isOfBaseclass(itemId, BaseClasses.KEYCARD)) {
					//logger.info(`[${this.modShortName}] keycard: ${itemId}`);
					keyCards.push(itemId);
					const itemToModify = handbookPrices.find(item => item.Id === itemId);
					if (itemToModify) {
						itemToModify.Price = Math.round(itemToModify.Price * config.keyTraderPricesMultiplier);
					}
					if (fleaPrices[itemId]) {
						fleaPrices[itemId] = Math.round(fleaPrices[itemId] * config.keyFleaPricesMultiplier);
					}
				} 
			}
		}

		let adjustedWeights = 0;
		let addedKeys = 0;

		if (config.keyWeight !== 0) {
			for (const key of keys) {
				const foundKeyJacket = jacket.itemDistribution.find(item => item.tpl === key);
				if (foundKeyJacket) {
					if (foundKeyJacket.relativeProbability < config.keyWeight) {
						foundKeyJacket.relativeProbability = config.keyWeight;
						adjustedWeights++;
					}
				} else {
					jacket.itemDistribution.push({
						tpl: key,
						relativeProbability: config.keyWeight
					});
					addedKeys++;
				}

				const foundKeyDuffle = duffleBag.itemDistribution.find(item => item.tpl === key);
				if (foundKeyDuffle) {
					if (foundKeyDuffle.relativeProbability < config.keyWeight) {
						foundKeyDuffle.relativeProbability = config.keyWeight;
						adjustedWeights++;
					}
				} else {
					duffleBag.itemDistribution.push({
						tpl: key,
						relativeProbability: config.keyWeight
					});
					addedKeys++;
				}

				const foundDeadScav = deadScav.itemDistribution.find(item => item.tpl === key);
				if (foundDeadScav) {
					if (foundDeadScav.relativeProbability < config.keyWeight) {
						foundDeadScav.relativeProbability = config.keyWeight;
						adjustedWeights++;
					}
				} else {
					deadScav.itemDistribution.push({
						tpl: key,
						relativeProbability: config.keyWeight
					});
					addedKeys++;
				}
			}
		}

		if (config.keycardWeight !== 0) {
			for (const keyCard of keyCards) {
				const foundKeyJacket = jacket.itemDistribution.find(item => item.tpl === keyCard);
				if (foundKeyJacket) {
					if (foundKeyJacket.relativeProbability < config.keycardWeight) {
						foundKeyJacket.relativeProbability = config.keycardWeight;
						adjustedWeights++;
					}
				} else {
					jacket.itemDistribution.push({
						tpl: keyCard,
						relativeProbability: config.keycardWeight
					});
					addedKeys++;
				}
	
				const foundKeyDuffle = duffleBag.itemDistribution.find(item => item.tpl === keyCard);
				if (foundKeyDuffle) {
					if (foundKeyDuffle.relativeProbability < config.keycardWeight) {
						foundKeyDuffle.relativeProbability = config.keycardWeight;
						adjustedWeights++;
					}
				} else {
					duffleBag.itemDistribution.push({
						tpl: keyCard,
						relativeProbability: config.keycardWeight
					});
					addedKeys++;
				}
	
				const foundDeadScav = deadScav.itemDistribution.find(item => item.tpl === keyCard);
				if (foundDeadScav) {
					if (foundDeadScav.relativeProbability < config.keycardWeight) {
						foundDeadScav.relativeProbability = config.keycardWeight;
						adjustedWeights++;
					}
				} else {
					deadScav.itemDistribution.push({
						tpl: keyCard,
						relativeProbability: config.keycardWeight
					});
					addedKeys++;
				}
			}
		}	

		logger.info(`[${this.modShortName}] ${adjustedWeights} keys weights were adjusted`);
		logger.info(`[${this.modShortName}] ${addedKeys} keys were added to jacket/duffle/dead scav loot`);


		jacket.itemcountDistribution = config.overRideLootDistributionJackets;
		duffleBag.itemcountDistribution = config.overRideLootDistributionDuffleBags;
		deadScav.itemcountDistribution = config.overRideLootDistributionDeadScavs;
		

		itemDB["578f8778245977358849a9b5"]._props.Grids[0]._props.cellsH = config.cellsH;
		itemDB["578f8778245977358849a9b5"]._props.Grids[0]._props.cellsV = config.cellsV;


		logger.success(`[${this.modShortName}] ${this.mod} finished loading`);
	}
}

module.exports = { mod: new KeysInLoot() }