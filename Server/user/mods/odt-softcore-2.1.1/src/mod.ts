import { DependencyContainer } from "tsyringe"

import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer"
import { ConfigServer } from "@spt-aki/servers/ConfigServer"
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes"
import { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import { ITraderConfig } from "@spt-aki/models/spt/config/ITraderConfig"
import { IRagfairConfig } from "@spt-aki/models/spt/config/IRagfairConfig"
import { IHideoutConfig } from "@spt-aki/models/spt/config/IHideoutConfig"
import { IInsuranceConfig } from "@spt-aki/models/spt/config/IInsuranceConfig"
import { IScavCaseConfig } from "@spt-aki/models/spt/config/IScavCaseConfig"
// import { IHideoutProduction } from "@spt-aki/models/eft/hideout/IHideoutProduction"

// import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor"
// import { LogBackgroundColor } from "@spt-aki/models/spt/logging/LogBackgroundColor"

// import { ObjectId } from "@spt-aki/utils/ObjectId" // [Debug]

// import * as fs from "fs" // [Debug] Used for file saving

import { itemBaseClasses } from "./itemBaseClasses"
import { BSGblacklist } from "./BSGblacklist"
import { scavcaseWhitelist, scavcaseItemBlacklist } from "./scavcaseLists"

import { VFS } from "@spt-aki/utils/VFS"
import path from "path"
import { jsonc } from "jsonc"

// import config from "../config/config.jsonc"

const fleaListingsWhitelist = require("../config/fleaListingsWhitelist.ts") // this Node.js module/require shit is bullshit.
const fleaBarterRequestsWhitelist = require("../config/fleaBarterRequestsWhitelist.ts") // why I can't use import in config directory? Anyway, is there any alternative to JSON data storage? THIS is the only way to save commented data?!
const fleaItemsWhiteList = require("../config/fleaItemsWhitelist.ts")

const debug = false // [Debug] Debug!

class Mod implements IPostDBLoadMod {
	public postDBLoad(container: DependencyContainer): void {
		const vfs = container.resolve<VFS>("VFS")
		const config = jsonc.parse(vfs.readFile(path.resolve(__dirname, "../config/config.jsonc")))
		const logger = container.resolve<ILogger>("WinstonLogger")
		const databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		const configServer = container.resolve<ConfigServer>("ConfigServer")
		// const ObjectId = container.resolve<ObjectId>("ObjectId") // [Debug]
		const tables = databaseServer.getTables()
		const locales = tables.locales.global
		const items = tables.templates.items
		const handbook = tables.templates.handbook
		const prices = tables.templates.prices
		const globals = tables.globals.config
		const traderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER)
		const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR)
		const hideoutConfig = configServer.getConfig<IHideoutConfig>(ConfigTypes.HIDEOUT)
		const insuranceConfig = configServer.getConfig<IInsuranceConfig>(ConfigTypes.INSURANCE)
		const scavcaseConfig = configServer.getConfig<IScavCaseConfig>(ConfigTypes.SCAVCASE)
		const prapor = tables.traders["54cb50c76803fa8b248b4571"]
		const therapist = tables.traders["54cb57776803fa99248b456e"]
		const ragman = tables.traders["5ac3b934156ae10c4430e83c"]
		const jaeger = tables.traders["5c0647fdd443bc2504c2d371"]
		const mechanic = tables.traders["5a7c2eca46aef81a7ca2145d"]
		const peacekeeper = tables.traders["5935c25fb3acc3127c3d8cd9"]
		const skier = tables.traders["58330581ace78e27b8b10cee"]
		const traderlist = [prapor, therapist, ragman, jaeger, mechanic, peacekeeper, skier]
		const profileList = ["Standard", "Left Behind", "Prepare To Escape", "Edge Of Darkness", "SPT Zero to hero"]

		const euroPrice = handbook.Items.find((x) => x.Id == "569668774bdc2da2298b4568").Price

		// Noice.
		const fleaBarterRequestBlacklist = itemBaseClasses.filter((x) => !fleaBarterRequestsWhitelist.includes(x))

		if (debug) {
			// [Debug]
			for (const i in items) {
				const item = items[i]
				if (item._type == "Item" && item._props.CanSellOnRagfair == false) {
					log(`"${item._id}", // ${getItemName(item._id)}`)
					// log(`"${item._id}", // ${item._name}`)
				}
			}
		}

		if (false) {
			let baseClassList = new Set()
			for (const i in items) {
				const item = items[i]
				if (item._type == "Item") {
					baseClassList.add(item._parent)
					// log(`"${item._id}", // ${item._name}`)
				}
			}
			baseClassList.forEach((i) => log(`"${i}", // ${getItemName(i)}`))
		}

		if (false) {
			for (const i of handbook.Categories) {
				// log(i.Id)
				// if (item._type == "Item") {
				// handbookCategoryList.add(item._parent)
				log(`"${i.Id}", // ${locales["en"][i.Id]}`)
				// }
			}
		}

		if (config.SecureContainersOptions.enabled) {
			if (config.SecureContainersOptions.Bigger_Containers.enabled) {
				// Waist Pouch
				items["5732ee6a24597719ae0c0281"]._props.Grids[0]._props.cellsV = 2
				items["5732ee6a24597719ae0c0281"]._props.Grids[0]._props.cellsH = 4

				// Secure container Alpha
				items["544a11ac4bdc2d470e8b456a"]._props.Grids[0]._props.cellsV = 3
				items["544a11ac4bdc2d470e8b456a"]._props.Grids[0]._props.cellsH = 3

				// Secure container Beta
				items["5857a8b324597729ab0a0e7d"]._props.Grids[0]._props.cellsV = 3
				items["5857a8b324597729ab0a0e7d"]._props.Grids[0]._props.cellsH = 4

				// Secure container Epsilon
				items["59db794186f77448bc595262"]._props.Grids[0]._props.cellsV = 3
				items["59db794186f77448bc595262"]._props.Grids[0]._props.cellsH = 5

				// Secure container Gamma
				items["5857a8bc2459772bad15db29"]._props.Grids[0]._props.cellsV = 4
				items["5857a8bc2459772bad15db29"]._props.Grids[0]._props.cellsH = 5

				// Secure container Kappa
				items["5c093ca986f7740a1867ab12"]._props.Grids[0]._props.cellsV = 5
				items["5c093ca986f7740a1867ab12"]._props.Grids[0]._props.cellsH = 5
			}

			if (config.SecureContainersOptions.Progressive_Containers.enabled) {
				try {
					// It seems Waist pouch does not protect againt in raid restrictions, so need to remove them alltogether.

					// items["5857a8bc2459772bad15db29"]._props.Grids[0]._props.filters[0].Filter.forEach(x => log(getItemName(x)))
					// items["5732ee6a24597719ae0c0281"]._props.Grids[0]._props.filters[0].Filter.forEach(x => log(getItemName(x)))

					// log(`---`)
					// items["5857a8bc2459772bad15db29"]._props.Grids[0]._props.filters[0].ExcludedFilter.forEach(x => log(getItemName(x)))
					// items["5732ee6a24597719ae0c0281"]._props.Grids[0]._props.filters[0].ExcludedFilter.forEach(x => log(getItemName(x)))

					try {
						items["5732ee6a24597719ae0c0281"]._props.CantRemoveFromSlotsDuringRaid[0] = "SecuredContainer"
					} catch (error) {
						logger.warning("\nAdjusting Waist Pouch CantRemoveFromSlotsDuringRaid failed. Send bug report. Continue safely.")
						log(error)
					}
					try {
						items["5732ee6a24597719ae0c0281"]._props.Grids[0]._props.filters = items["5857a8bc2459772bad15db29"]._props.Grids[0]._props.filters
					} catch (error) {
						logger.warning("\nAdjusting Waist Pouch Grids[0]._props.filters failed. Send bug report. Continue safely.")
						log(error)
					}

					for (const profile of profileList) {
						tables.templates.profiles[profile].bear.character.Inventory.items.find((x) => x.slotId == "SecuredContainer")._tpl = "5732ee6a24597719ae0c0281"
						tables.templates.profiles[profile].usec.character.Inventory.items.find((x) => x.slotId == "SecuredContainer")._tpl = "5732ee6a24597719ae0c0281"
					}

					// Beta container from PK "removal"
					peacekeeper.assort.barter_scheme["65cb82377e8e8aec5b087ef4"][0].forEach((x) => (x.count = 5))

					// Proper removal below:
					// peacekeeper.assort.items = peacekeeper.assort.items.filter((x) => x._id != "6507ff2a644a656aee0f8073")
					// peacekeeper.assort.barter_scheme["6507ff2a644a656aee0f8073"] = []

					const Alpha = {
						_id: "63da4dbee8fa73e22500001a",

						areaType: 10,
						requirements: [
							{ areaType: 10, requiredLevel: 1, type: "Area" },
							{
								templateId: "567143bf4bdc2d1a0f8b4567",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
							{
								templateId: "5783c43d2459774bbe137486",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
							{
								templateId: "5c093e3486f77430cb02e593",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
							{
								templateId: "590c621186f774138d11ea29",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
						],
						productionTime: 5600,
						boosters: null,
						endProduct: "544a11ac4bdc2d470e8b456a",
						continuous: false,
						count: 1,
						productionLimitCount: 0,
					}
					const Beta = {
						_id: "63da4dbee8fa73e22500001b",

						areaType: 10,
						requirements: [
							{ areaType: 10, requiredLevel: 1, type: "Area" },
							{
								templateId: "544a11ac4bdc2d470e8b456a",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
							{
								templateId: "5aafbde786f774389d0cbc0f",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
							{
								templateId: "590c60fc86f77412b13fddcf",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
							{
								templateId: "62a0a16d0b9d3c46de5b6e97",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
						],
						productionTime: 10800,
						boosters: null,
						endProduct: "5857a8b324597729ab0a0e7d",
						continuous: false,
						count: 1,
						productionLimitCount: 0,
					}
					const Epsilon = {
						_id: "63da4dbee8fa73e22500001c",

						areaType: 10,
						requirements: [
							{ areaType: 10, requiredLevel: 2, type: "Area" },
							{
								templateId: "5857a8b324597729ab0a0e7d",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
							{
								templateId: "5c127c4486f7745625356c13",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
							{
								templateId: "59fafd4b86f7745ca07e1232",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
							{
								templateId: "619cbf9e0a7c3a1a2731940a",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
							{
								templateId: "61bf7c024770ee6f9c6b8b53",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
						],
						productionTime: 35000,
						boosters: null,
						endProduct: "59db794186f77448bc595262",
						continuous: false,
						count: 1,
						productionLimitCount: 0,
					}
					const Gamma = {
						_id: "63da4dbee8fa73e22500001d",

						areaType: 10,
						requirements: [
							{ areaType: 10, requiredLevel: 3, type: "Area" },
							{
								templateId: "59db794186f77448bc595262",
								count: 2,
								isFunctional: false,
								type: "Item",
							},

							{
								templateId: "5e2af55f86f7746d4159f07c",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
							{
								templateId: "59fb016586f7746d0d4b423a",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
							{
								templateId: "5d235bb686f77443f4331278",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
							{
								templateId: "619cbf7d23893217ec30b689",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
							{
								templateId: "6389c7750ef44505c87f5996",
								count: 2,
								isFunctional: false,
								type: "Item",
							},
						],
						productionTime: 61200,
						boosters: null,
						endProduct: "5857a8bc2459772bad15db29",
						continuous: false,
						count: 1,
						productionLimitCount: 0,
					}

					tables.hideout.production.push(Alpha, Beta, Epsilon, Gamma)

					if (config.SecureContainersOptions.Progressive_Containers.Collector_Quest_Redone.enabled == true) {
						// Add the surprise
						tables.templates.quests["5c51aac186f77432ea65c552"].conditions.AvailableForFinish.push({
							conditionType: "HandoverItem",
							dogtagLevel: 0,
							id: "639135534b15ca31f76bc319",
							index: 69, // nice
							maxDurability: 100,
							minDurability: 0,
							parentId: "",
							isEncoded: false,
							onlyFoundInRaid: false,
							dynamicLocale: false,
							target: ["5857a8bc2459772bad15db29"],
							value: 2,
							visibilityConditions: [],
						})

						tables.locales.global["ru"]["639135534b15ca31f76bc319"] = "Передать носитель" // Тут нужен только фикс для русского, для всех остальных языков звучит как "Hand over the storage device"

						// Remove level req from finish
						tables.templates.quests["5c51aac186f77432ea65c552"].conditions.AvailableForFinish = tables.templates.quests[
							"5c51aac186f77432ea65c552"
						].conditions.AvailableForFinish.filter((x) => x.conditionType != "Level")

						// Start condition
						tables.templates.quests["5c51aac186f77432ea65c552"].conditions.AvailableForStart = [
							{
								compareMethod: ">=",
								conditionType: "Level",
								dynamicLocale: false,
								globalQuestCounterId: "",
								id: "51d33b2d4fad9e61441772c0",
								index: 1,
								parentId: "",
								value: 10,
								visibilityConditions: [],
							},
						]
					}
				} catch (error) {
					logger.warning("\nSecureContainersOptions.Progressive_Containers failed. Send bug report. Continue safely.")
					log(error)
				}
			}
		}

		if (config.ScavCaseOptions.enabled) {
			try {
				if (config.ScavCaseOptions.BetterRewards.enabled) {
					// buyableitems generator, to make sure rare unbuyable items always are in reward pool (eg anodised red gear)
					const buyableitems = new Set()
					for (const trader of traderlist) {
						try {
							trader.assort.items.filter((x) => buyableitems.add(x._tpl))
						} catch (error) {
							logger.warning(
								"trader.assort.items.filter for buyableitems function failed bacause of the other mod. Ignore this error safely and continue. Send bug report."
							)
							log(error)
						}
					}

					// Shitlist generator for scav case rewards. Filters A LOT of crap out, but very conservatevely. Blacklist included in ./docs folder check it out.
					// Always includes items in carefully curated whitelist. Always includes unbuyable and/or cheap items not included in whitelist (such as anodized red gear, but also some crap like scav only hats). Always includes items worth > 10000. Filters everything else out. Spent a lot of time thinking about this, really proud of myself. In the end, just makes sure you almost always get something of valuable or usable.
					const scavWhitelist = [] // [Debug] used for debug code below
					for (const i in items) {
						const item = items[i]
						if (item._type == "Item") {
							if (debug) {
								item._props.ExaminedByDefault = true // For my sanity
							}
							const itemInHandbook = getItemInHandbook(item._id)

							if (item._parent == "543be5cb4bdc2deb348b4568") {
								try {
									// Ammo boxes price patch/fix, their data in handbook is always 1k, this makes them valued as ammo*count they contain.
									const count = item._props.StackSlots[0]._max_count
									const ammo = item._props.StackSlots[0]._props.filters[0].Filter[0]

									const value = Math.round(getItemInHandbook(ammo).Price * count)

									handbook.Items.find((x) => x.Id == item._id).Price = value
								} catch (error) {
									logger.warning(
										"handbook.Items.find((x) => x.Id == item._id).Price = value function failed bacause of the other mod. Ignore this error safely and continue. Send bug report."
									)
									log(error)
								}
							}

							if (
								(itemInHandbook?.Price >= 10000 || scavcaseWhitelist.includes(item._parent) || !buyableitems.has(item._id)) &&
								!scavcaseItemBlacklist.includes(item._id) &&
								item._props.QuestItem != true &&
								itemInHandbook?.Price != undefined
								// && !scavcaseConfig.rewardItemParentBlacklist.includes(item._parent) // [Debug] not actually needed, used only for reference when generating black/whitelists. Ignore(? TODO: look into it) ammo and money here, they are a special case in SPI-AKI logic.
							) {
								// whitelist here, do nothing.
								if (debug) {
									scavWhitelist.push(item._id) // [Debug] used for debug code below
									// log(getItemName(item._parent) + "	" + itemInHandbook?.Price + "	" + getItemName(item._id) + "	" + item._id) // [Debug]
								}
							} else {
								scavcaseConfig.rewardItemBlacklist.push(item._id)
								// shitlist here.
								if (debug) {
									// log(getItemName(item._parent) + "	" + itemInHandbook?.Price + "	" + getItemName(item._id) + "	" + item._id) // [Debug]
								}
							}
						}
					}

					// Object.values(scavcaseConfig.ammoRewards.ammoRewardBlacklist).forEach(x => x.push(scavcaseItemBlacklist))
					// log(scavcaseConfig)
				}

				if (config.ScavCaseOptions.Rebalance.enabled) {
					scavcaseConfig.rewardItemValueRangeRub = {
						common: {
							// AVG 7941
							min: 1,
							max: 20000,
						},
						rare: {
							// AVG 36415
							min: 20001,
							max: 60000,
						},
						superrare: {
							// AVG 157978
							min: 60001,
							max: 1200000,
						},
					}

					const scavCaseRedone = [
						{
							EndProducts: {
								Common: {
									min: 2,
									max: 3,
								},
								Rare: {
									min: 0,
									max: 0,
								},
								Superrare: {
									min: 0,
									max: 0,
								},
							},
							ProductionTime: 2500,
							Requirements: [
								{
									count: 1,
									isEncoded: false,
									isFunctional: false,
									templateId: "62a09f32621468534a797acb", // Pevko, T1 62a09f32621468534a797acb
									type: "Item",
								},
							],
							_id: "62710974e71632321e5afd5f",
						},
						{
							EndProducts: {
								Common: {
									min: 3,
									max: 4,
								},
								Rare: {
									min: 0,
									max: 1,
								},
								Superrare: {
									min: 0,
									max: 0,
								},
							},
							ProductionTime: 7700,
							Requirements: [
								{
									count: 1,
									isEncoded: false,
									isFunctional: false,
									templateId: "5d40407c86f774318526545a", // Vodka T2 5d40407c86f774318526545a
									type: "Item",
								},
							],
							_id: "62710a8c403346379e3de9be",
						},

						{
							EndProducts: {
								Common: {
									min: 4,
									max: 5,
								},
								Rare: {
									min: 1,
									max: 2,
								},
								Superrare: {
									min: 0,
									max: 0,
								},
							},
							ProductionTime: 8100,
							Requirements: [
								{
									count: 1,
									isEncoded: false,
									isFunctional: false,
									templateId: "5d403f9186f7743cac3f229b", // Whisky T3 5d403f9186f7743cac3f229b
									type: "Item",
								},
							],
							_id: "62710a69adfbd4354d79c58e",
						},
						{
							EndProducts: {
								Common: {
									min: 2,
									max: 3,
								},
								Rare: {
									min: 0,
									max: 3,
								},
								Superrare: {
									min: 1,
									max: 2,
								},
							},
							ProductionTime: 16800,
							Requirements: [
								{
									count: 1,
									isEncoded: false,
									isFunctional: false,
									templateId: "5d1b376e86f774252519444e", // Moonshine 5d1b376e86f774252519444e
									type: "Item",
								},
							],
							_id: "6271093e621b0a76055cd61e",
						},
						{
							EndProducts: {
								Common: {
									min: 2,
									max: 3,
								},
								Rare: {
									min: 3,
									max: 5,
								},
								Superrare: {
									min: 0,
									max: 1,
								},
							},
							ProductionTime: 19200,
							Requirements: [
								{
									count: 1,
									isEncoded: false,
									isFunctional: false,
									templateId: "5c12613b86f7743bbe2c3f76", // Intel, 5c12613b86f7743bbe2c3f76
									type: "Item",
								},
							],
							_id: "62710a0e436dcc0b9c55f4ec",
						},
					]

					try {
						tables.hideout.scavcase = scavCaseRedone // mi donta undestanda tem red wavy lines, tis bad? tis worka! tis gooda! donta cera wavy lines.
					} catch (error) {
						log(error) // Akey, mi kinda scary red ~~~ lines. Mi try-ketchup it.
					}
				}
				if (config.ScavCaseOptions.FasterScavcase.enabled) {
					try {
						tables.hideout.scavcase.forEach((x) => {
							if (debug) {
								x.ProductionTime = 1
								x.Requirements[0].templateId = "5449016a4bdc2d6f028b456f"
							} else {
								x.ProductionTime /= config.ScavCaseOptions.FasterScavcase.SpeedMultiplier
							}
						})
					} catch (error) {
						logger.warning("\nScavCaseOptions.FasterScavcase failed. Send bug report. Continue safely.")
						log(error)
					}
				}
				if (debug) {
					// Random WIP testing code here, I like it, I saved it, ignore it, or use it for debug or your mods.
					//
					// [Debug] Master item list logger OR, optionally filters based on parent class
					// Object.values(items)
					// 	// .filter((x) => x._parent == "543be6564bdc2df4348b4568")
					// 	.map((x) => {
					// 		const price = getItemInHandbook(x._id)?.Price
					// 		log(getItemName(x._parent) + ": " + getItemName(x._id) + ", " + price + " // " + x._id)
					// 	})
					//
					// [Debug] WIP item list logger with file saving, itterates all base classes and filters stuff. Strong stuff, can't remember what it actually does now, was using it to to balance tiers lists.
					// let gg = []
					// for (let i = 0; i < baseClasses.length; i++) {
					// 	const baseclass = baseClasses[i]
					// 	if (scavcaseBlacklist.includes(baseclass)) {
					// 		Object.values(items)
					// 			.filter((x) => x._parent == baseclass)
					// 			.map((x) => {
					// 				const price = getItemInHandbook(x._id)?.Price
					// 				if (price > 10000) {
					// 					gg.push(getItemName(x._parent) + "	" + getItemName(x._id) + "	" + price + "\n")
					// 				}
					// 			})
					// 	}
					// 	if (i == baseClasses.length - 1) {
					// 		const ggs = gg.toString()
					// 		fs.writeFile("./test_b.txt", ggs, (err) => {
					// 			if (err) {
					// 				console.error(err)
					// 			}
					// 			log("OK!")
					// 		})
					// 	}
					// }
					//
					// [Debug] Scavcase tier lists generators, enable scavWhitelist above.
					// const commonItems = scavWhitelist.filter(
					// 	(x) =>
					// 		getItemInHandbook(x).Price >= scavcaseConfig.rewardItemValueRangeRub.common.min &&
					// 		getItemInHandbook(x).Price <= scavcaseConfig.rewardItemValueRangeRub.common.max
					// )
					// const rareItems = scavWhitelist.filter(
					// 	(x) =>
					// 		getItemInHandbook(x).Price >= scavcaseConfig.rewardItemValueRangeRub.rare.min &&
					// 		getItemInHandbook(x).Price <= scavcaseConfig.rewardItemValueRangeRub.rare.max
					// )
					// const superrareItems = scavWhitelist.filter(
					// 	(x) =>
					// 		getItemInHandbook(x).Price >= scavcaseConfig.rewardItemValueRangeRub.superrare.min &&
					// 		getItemInHandbook(x).Price <= scavcaseConfig.rewardItemValueRangeRub.superrare.max
					// )
					// [Debug] Tier lists loggers
					// commonItems.map(x => log(getItemName(x) + " " + getItemInHandbook(x).Price + " " + x))
					// rareItems.map(x => log(getItemName(x) + " " + getItemInHandbook(x).Price + " " + x))
					// superrareItems.map(x => log(getItemName(x) + " " + getItemInHandbook(x).Price + " " + x))
					//
					// [Debug] AVG sum for tier calc
					//		let sum = 0
					//		for (let i = 0; i < superrareItems.length; i++) {
					//			const item = superrareItems[i]
					//
					//			sum += getItemInHandbook(item).Price
					//		}
					//		log(sum / superrareItems.length)
					//
					// [Debug] Comment generator with filter for ALL items, for white/black lists, shows item names
					// Object.values(items)
					// .filter((x) => x._props.CanSellOnRagfair == false && x._type == "Item")
					// .map((x) => log(`"${x._id}", // ${getItemName(x._id)}`));
					//
					// [Debug] Comment generator for white/black lists, shows item names, universally usefull for different arrays
					// itemWhitelist.map((x) => log(`"${x}", // ${getItemName(x)}`));
					//
					// [Debug] Stale code, filters and logs ALL items
					//	Object.values(items)
					//		.filter((x) => {
					//			const price = getItemInHandbook(x._id)?.Price
					//			return price >= 10000 && price <= 20000
					//		})
					//		.map((x) => {
					//			const price = getItemInHandbook(x._id)?.Price
					//			log(getItemName(x._id) + ": " + price)
					//		})
				}
			} catch (error) {
				logger.warning("\nScavCaseOptions failed. Send bug report. Continue safely.")
				log(error)
			}
		}

		if (config.HideoutOptions.enabled) {
			if (config.HideoutOptions.StashOptions.enabled) {
				// Fix for ADHD.

				// stash area id 5d484fc0654e76006657e0ab
				// "_id": "566abbc34bdc2d92178b4576",
				// "_name": "Standard stash 10x28",
				// "_id": "5811ce572459770cba1a34ea",
				// "_name": "Left Behind stash 10x38",
				// "_id": "5811ce662459770f6f490f32",
				// "_name": "Prepare for escape stash 10x48",
				// "_id": "5811ce772459770e9e5f9532",
				// "_name": "Edge of darkness stash 10x68",

				if (config.HideoutOptions.StashOptions.BiggerStash.enabled) {
					try {
						items["566abbc34bdc2d92178b4576"]._props.Grids[0]._props.cellsV = 50
						items["5811ce572459770cba1a34ea"]._props.Grids[0]._props.cellsV = 100
						items["5811ce662459770f6f490f32"]._props.Grids[0]._props.cellsV = 150
						items["5811ce772459770e9e5f9532"]._props.Grids[0]._props.cellsV = 200
					} catch (error) {
						logger.warning("\nHideoutOptions.StashOptions.BiggerStash failed. Send bug report. Continue safely.")
						log(error)
					}
				}

				const originalStages = tables.hideout.areas.find((x) => x._id == "5d484fc0654e76006657e0ab").stages

				for (const stage in originalStages) {
					if (config.HideoutOptions.StashOptions.Easier_Loyalty.enabled == true) {
						try {
							originalStages[stage].requirements
								.filter((x) => x.loyaltyLevel != undefined)
								.forEach((x) => {
									x.loyaltyLevel -= 1
								})
						} catch (error) {
							logger.warning("\nHideoutOptions.StashOptions.Easier_Loyalty failed. Send bug report. Continue safely.")
							log(error)
						}
					}

					if (config.HideoutOptions.StashOptions.Less_Currency_For_Construction.enabled == true) {
						try {
							originalStages[stage].requirements
								.filter((x) => x.templateId == "5449016a4bdc2d6f028b456f" || x.templateId == "569668774bdc2da2298b4568")
								.forEach((x) => {
									x.count /= 10
								})
						} catch (error) {
							logger.warning("\nHideoutOptions.StashOptions.Less_Currency_For_Construction failed. Send bug report. Continue safely.")
							log(error)
						}
					}
				}

				try {
					tables.hideout.areas.find((x) => x._id == "5d484fc0654e76006657e0ab").stages = originalStages
				} catch (error) {
					logger.warning("\nHideoutOptions.StashOptions (Easier_Loyalty or Less_Currency_For_Construction) failed. Send bug report. Continue safely.")
					log(error)
				}

				if (config.HideoutOptions.StashOptions.Progressive_Stash.enabled == true) {
					const basicStashBonuses = [
						{
							id: "64f5b9e5fa34f11b380756c0",
							templateId: "566abbc34bdc2d92178b4576",
							type: "StashSize",
						},
					]
					for (const profile of profileList) {
						try {
							tables.templates.profiles[profile].bear.character.Hideout.Areas.find((x) => x.type == "3").level = 1
							tables.templates.profiles[profile].usec.character.Hideout.Areas.find((x) => x.type == "3").level = 1

							tables.templates.profiles[profile].bear.character.Inventory.items
								.filter((x) => x._tpl == "5811ce572459770cba1a34ea" || x._tpl == "5811ce662459770f6f490f32" || x._tpl == "5811ce772459770e9e5f9532")
								.forEach((element) => {
									element._tpl = "566abbc34bdc2d92178b4576"
								})
							tables.templates.profiles[profile].usec.character.Inventory.items
								.filter((x) => x._tpl == "5811ce572459770cba1a34ea" || x._tpl == "5811ce662459770f6f490f32" || x._tpl == "5811ce772459770e9e5f9532")
								.forEach((element) => {
									element._tpl = "566abbc34bdc2d92178b4576"
								})
							tables.templates.profiles[profile].bear.character.Bonuses = basicStashBonuses
							tables.templates.profiles[profile].usec.character.Bonuses = basicStashBonuses
						} catch (error) {
							logger.warning("\nconfig.HideoutOptions.BiggerStash.Progressive_Stash error")
							log(error)
						}
					}
				}
			}
			// 100x Faster hideout production, 10x superwater and moonshine production, bitcoins
			for (const prod in tables.hideout.production) {
				const endProduct = tables.hideout.production[prod].endProduct
				const productionTime = tables.hideout.production[prod].productionTime
				if (
					(endProduct == "5d1b376e86f774252519444e" || endProduct == "5d1b33a686f7742523398398") &&
					config.HideoutOptions.Faster_Moonshine_and_Purified_Water_Production.enabled
				) {
					// superwater and moonshine
					tables.hideout.production[prod].productionTime = Math.round(
						productionTime / config.HideoutOptions.Faster_Moonshine_and_Purified_Water_Production.Base_Moonshine_And_Water_Time_Multiplier
					)
				} else if (endProduct == "59faff1d86f7746c51718c9c" && config.HideoutOptions.Faster_Bitcoin_Farming.enabled == true) {
					// bitcoins
					tables.hideout.production[prod].productionTime = Math.round(
						productionTime / config.HideoutOptions.Faster_Bitcoin_Farming.Base_Bitcoin_Time_Multiplier
					)
					if (config.HideoutOptions.Faster_Bitcoin_Farming.Revert_Bitcoin_Price_To_v012 == true) {
						tables.templates.handbook.Items.find((x) => x.Id == "59faff1d86f7746c51718c9c").Price = 100000
					}
				} else if (config.HideoutOptions.Faster_Crafting_Time.enabled) {
					// all other crafts
					tables.hideout.production[prod].productionTime =
						Math.round(productionTime / config.HideoutOptions.Faster_Crafting_Time.Base_Crafting_Time_Multiplier) + 1
				}
			}

			if (config.HideoutOptions.Faster_Crafting_Time.enabled && config.HideoutOptions.Faster_Crafting_Time.Hideout_Skill_Exp_Fix.enabled) {
				// Buff to hideout exp rate, more testing needed
				hideoutConfig.hoursForSkillCrafting /= config.HideoutOptions.Faster_Crafting_Time.Hideout_Skill_Exp_Fix.Hideout_Skill_Exp_Multiplier
			}

			if (config.HideoutOptions.Faster_Bitcoin_Farming.enabled) {
				// Instead of modifing base farming time try this:
				tables.hideout.settings.gpuBoostRate = config.HideoutOptions.Faster_Bitcoin_Farming.GPU_Efficiency

				// TODO: replace getBTCSlots() in HideoutHelper to add bonus slots per farm level. lv2 - 4 slots, lv3 - 5, elite - 7

				// Vanilla: Base time (x1): 40h 17min (2417 min), GPU Boost (0.041225): x1, each GPU has only ~4.12% efficiency
				// 2× GPU: 38h 41min x1.04
				// 10× GPU: 29h 23min x1.37
				// 25× GPU: 20h 15min x1.99
				// 50× GPU: 13h 20min x3.02

				// Softcore v0.1: Base time (x10): 4h 2min, GPU Boost (0.041225): x1
				// 2× GPU: 3h 52min x1.04
				// 10× GPU: 2h 56min x1.37
				// 25× GPU: 2h 1min x1.99
				// 50× GPU: 1h 20min x3.02

				// Softcore v0.2: Base time (x2): 20h 8min, GPU Boost(0.5): x12.13, each GPU has ~50% efficiency
				// 2× GPU: 13h 26min x1.5
				// 10× GPU: 3h 40min x5.5
				// 25× GPU: 1h 33min x13
				// 50× GPU: 0h 47min x25.5

				// Linear: Base time (x1): 40h 17min, GPU Boost (1): x24.26, each GPU is 100% efficient
				// 2× GPU: 20h 8min x2
				// 10× GPU: 4h 2min x10
				// 25× GPU: 1h 37min x25
				// 50× GPU: 0h 48min x50
			}

			if (config.HideoutOptions.Faster_Hideout_Construction.enabled) {
				// 100x Faster hideout construction
				for (const area in tables.hideout.areas) {
					for (const stage in tables.hideout.areas[area].stages) {
						tables.hideout.areas[area].stages[stage].constructionTime = Math.round(
							tables.hideout.areas[area].stages[stage].constructionTime / config.HideoutOptions.Faster_Hideout_Construction.Hideout_Construction_Time_Multiplier
						)
					}
				}
			}

			if (config.HideoutOptions.Increased_Fuel_Consumption.enabled) {
				// 10x faster fuel draw
				tables.hideout.settings.generatorFuelFlowRate *= config.HideoutOptions.Increased_Fuel_Consumption.Fuel_Consumption_Multiplier
			}
		}

		if (config.AdditionalCraftingRecipes.enabled == true) {
			try {
				// 63da4dbee8fa73e225000001
				// 63da4dbee8fa73e225000002
				// 63da4dbee8fa73e225000003
				// 63da4dbee8fa73e225000004
				// 63da4dbee8fa73e225000005
				// 63da4dbee8fa73e225000006
				// 63da4dbee8fa73e225000007
				// 63da4dbee8fa73e225000008
				// 63da4dbee8fa73e225000009
				// 63da4dbee8fa73e22500000a

				const Ophthalmoscope = {
					_id: "63da4dbee8fa73e225000001",

					areaType: 7,
					requirements: [
						{ areaType: 7, requiredLevel: 3, type: "Area" },
						{
							templateId: "5e2aedd986f7746d404f3aa4",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "619cc01e0a7c3a1a2731940c",
							count: 2,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "57d17c5e2459775a5c57d17d",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "5b4391a586f7745321235ab2",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "57347c1124597737fb1379e3",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
					],
					productionTime: 105,
					boosters: null,
					endProduct: "5af0534a86f7743b6f354284",
					continuous: false,
					count: 1,
					productionLimitCount: 0,
				}
				const Zagustin = {
					_id: "63da4dbee8fa73e225000002",

					areaType: 7,
					requirements: [
						{ areaType: 7, requiredLevel: 3, type: "Area" },
						{
							templateId: "5c0e530286f7747fa1419862",
							count: 2,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "5e8488fa988a8701445df1e4",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "5ed515f6915ec335206e4152",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
					],
					productionTime: 105,
					boosters: null,
					endProduct: "5c0e533786f7747fa23f4d47",
					continuous: false,
					count: 3,
					productionLimitCount: 0,
				}
				const Obdolbos = {
					// Did you always want to run your own meth lab in Tarkov? Now you can.
					_id: "63da4dbee8fa73e225000003",

					areaType: 7,
					requirements: [
						{ areaType: 7, requiredLevel: 3, type: "Area" },
						{
							templateId: "5c0e531286f7747fa54205c2",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "5b43575a86f77424f443fe62",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "5e2af00086f7746d3f3c33f7",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "62a09f32621468534a797acb",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "5d40407c86f774318526545a",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "5d403f9186f7743cac3f229b",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "5d1b376e86f774252519444e",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "5d1b2f3f86f774252167a52c",
							type: "Tool",
						},
					],
					productionTime: 564,
					boosters: null,
					endProduct: "5ed5166ad380ab312177c100",
					continuous: false,
					count: 8,
					productionLimitCount: 0,
				}
				const CALOK = {
					_id: "63da4dbee8fa73e225000004",

					areaType: 7,
					requirements: [
						{ areaType: 7, requiredLevel: 2, type: "Area" },
						{
							templateId: "59e35abd86f7741778269d82", // Pack of sodium bicarbonate
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "5755383e24597772cb798966", // Vaseline balm
							count: 1,
							isFunctional: false,
							type: "Item",
						},
					],
					productionTime: 48,
					boosters: null,
					endProduct: "5e8488fa988a8701445df1e4",
					continuous: false,
					count: 2,
					productionLimitCount: 0,
					// Granular nature? Check.
					// Stops blood with magical properties of pain-relieving Tarkov Vaseline? Check.
					// Fun and economically balanced recipe that includes underused items? Triple check.
				}
				const Adrenaline = {
					_id: "63da4dbee8fa73e225000005",

					areaType: 7,
					requirements: [
						{ areaType: 7, requiredLevel: 2, type: "Area" },
						{
							templateId: "5751496424597720a27126da",
							count: 3,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "5755356824597772cb798962",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
					],
					productionTime: 23,
					boosters: null,
					endProduct: "5c10c8fd86f7743d7d706df3",
					continuous: false,
					count: 1,
					productionLimitCount: 0,
				}
				const ThreebTG = {
					_id: "63da4dbee8fa73e225000006",

					areaType: 7,
					requirements: [
						{ areaType: 7, requiredLevel: 3, type: "Area" },
						{
							templateId: "5c10c8fd86f7743d7d706df3",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "59e361e886f774176c10a2a5",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "57505f6224597709a92585a9",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
					],
					productionTime: 31,
					boosters: null,
					endProduct: "5ed515c8d380ab312177c0fa",
					continuous: false,
					count: 2,
					productionLimitCount: 0,
				}
				const AHF1 = {
					_id: "63da4dbee8fa73e225000007",

					areaType: 7,
					requirements: [
						{ areaType: 7, requiredLevel: 2, type: "Area" },
						{
							templateId: "590c695186f7741e566b64a2",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "544fb3f34bdc2d03748b456a",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
					],
					productionTime: 47,
					boosters: null,
					endProduct: "5ed515f6915ec335206e4152",
					continuous: false,
					count: 1,
					productionLimitCount: 0,
				}
				const OLOLO = {
					_id: "63da4dbee8fa73e225000008",

					areaType: 8,
					requirements: [
						{ areaType: 8, requiredLevel: 3, type: "Area" },
						{
							templateId: "57513f9324597720a7128161",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "57513fcc24597720a31c09a6",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "57513f07245977207e26a311",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "575062b524597720a31c09a1",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "544fb62a4bdc2dfb738b4568",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "544fb37f4bdc2dee738b4567",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "5d1b385e86f774252167b98a",
							type: "Tool",
						},
						{
							templateId: "590de71386f774347051a052",
							type: "Tool",
						},
					],
					productionTime: 71,
					boosters: null,
					endProduct: "62a0a043cf4a99369e2624a5",
					continuous: false,
					count: 3,
					productionLimitCount: 0,
				}
				const L1 = {
					_id: "63da4dbee8fa73e225000009",

					areaType: 7,
					requirements: [
						{ areaType: 7, requiredLevel: 3, type: "Area" },
						{
							templateId: "5c10c8fd86f7743d7d706df3",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "5c0e531d86f7747fa23f4d42",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
					],
					productionTime: 71,
					boosters: null,
					endProduct: "5ed515e03a40a50460332579",
					continuous: false,
					count: 1,
					productionLimitCount: 0,
				}
				const P22 = {
					_id: "63da4dbee8fa73e225000010",

					areaType: 7,
					requirements: [
						{ areaType: 7, requiredLevel: 3, type: "Area" },
						{
							templateId: "5c10c8fd86f7743d7d706df3",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "59e361e886f774176c10a2a5",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "57505f6224597709a92585a9",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
					],
					productionTime: 31,
					boosters: null,
					endProduct: "5ed515c8d380ab312177c0fa",
					continuous: false,
					count: 2,
					productionLimitCount: 0,
				}
				const Trimadol = {
					_id: "63da4dbee8fa73e225000011",

					areaType: 7,
					requirements: [
						{ areaType: 7, requiredLevel: 3, type: "Area" },
						{
							templateId: "5ed515c8d380ab312177c0fa",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "5ed515e03a40a50460332579",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
					],
					productionTime: 52,
					boosters: null,
					endProduct: "637b620db7afa97bfc3d7009",
					continuous: false,
					count: 2,
					productionLimitCount: 0,
				}
				const Meldonin = {
					_id: "63da4dbee8fa73e225000012",

					areaType: 7,
					requirements: [
						{ areaType: 7, requiredLevel: 3, type: "Area" },
						{
							templateId: "5ed515e03a40a50460332579",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "5ed51652f6c34d2cc26336a1",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
					],
					productionTime: 39,
					boosters: null,
					endProduct: "5ed5160a87bb8443d10680b5",
					continuous: false,
					count: 2,
					productionLimitCount: 0,
				}
				const PNB = {
					_id: "63da4dbee8fa73e225000013",

					areaType: 7,
					requirements: [
						{ areaType: 7, requiredLevel: 3, type: "Area" },
						{
							templateId: "5c10c8fd86f7743d7d706df3",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "59e361e886f774176c10a2a5",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "57505f6224597709a92585a9",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
					],
					productionTime: 31,
					boosters: null,
					endProduct: "5ed515c8d380ab312177c0fa",
					continuous: false,
					count: 2,
					productionLimitCount: 0,
				}
				const Perfotran = {
					_id: "63da4dbee8fa73e225000014",

					areaType: 7,
					requirements: [
						{ areaType: 7, requiredLevel: 3, type: "Area" },
						{
							templateId: "5c0e533786f7747fa23f4d47",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "5fca138c2a7b221b2852a5c6",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "5c0e530286f7747fa1419862",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
					],
					productionTime: 45,
					boosters: null,
					endProduct: "637b6251104668754b72f8f9",
					continuous: false,
					count: 2,
					productionLimitCount: 0,
				}
				const SJ9 = {
					_id: "63da4dbee8fa73e225000015",

					areaType: 7,
					requirements: [
						{ areaType: 7, requiredLevel: 3, type: "Area" },
						{
							templateId: "5c10c8fd86f7743d7d706df3",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "59e361e886f774176c10a2a5",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "57505f6224597709a92585a9",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
					],
					productionTime: 31,
					boosters: null,
					endProduct: "5ed515c8d380ab312177c0fa",
					continuous: false,
					count: 2,
					productionLimitCount: 0,
				}
				const SJ12 = {
					_id: "63da4dbee8fa73e225000016",

					areaType: 7,
					requirements: [
						{ areaType: 7, requiredLevel: 3, type: "Area" },
						{
							templateId: "5c10c8fd86f7743d7d706df3",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "59e361e886f774176c10a2a5",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
						{
							templateId: "57505f6224597709a92585a9",
							count: 1,
							isFunctional: false,
							type: "Item",
						},
					],
					productionTime: 31,
					boosters: null,
					endProduct: "5ed515c8d380ab312177c0fa",
					continuous: false,
					count: 2,
					productionLimitCount: 0,
				}
				tables.hideout.production.push(ThreebTG, Adrenaline, L1, AHF1, CALOK, Ophthalmoscope, Zagustin, Obdolbos, OLOLO, Perfotran, Trimadol, Meldonin)
			} catch (error) {
				logger.warning("\nAdditionalCraftingRecipes failed. Send bug report. Continue safely.")
				log(error)
			}
		}

		if (config.OtherTweaks.enabled) {
			if (config.OtherTweaks.Quest_Changes.enabled) {
				try {
					tables.templates.quests["60e71c48c1bfa3050473b8e5"].conditions.AvailableForStart[1].value = 30
				} catch (error) {
					logger.warning("\nOtherTweaks.Quest_Changes failed. Send bug report. Continue safely.")
					log(error)
				}
			}

			if (config.OtherTweaks.Skill_Exp_Buffs.enabled) {
				try {
					globals.SkillsSettings.Vitality.DamageTakenAction *= 10
					globals.SkillsSettings.Sniper.WeaponShotAction *= 10
					globals.SkillsSettings.Surgery.SurgeryAction *= 10
					Object.values(globals.SkillsSettings.Immunity).forEach((x) => x * 10)
					Object.values(globals.SkillsSettings.StressResistance).forEach((x) => x * 10)
					Object.values(globals.SkillsSettings.MagDrills).forEach((x) => x * 10)
					globals.SkillsSettings.WeaponTreatment.SkillPointsPerRepair *= 100
				} catch (error) {
					logger.warning("\nOtherTweaks.Skill_Exp_Buffs failed. Send bug report. Continue safely.")
					log(error)
				}
			}

			if (config.OtherTweaks.Allow_Gym_Training_With_Muscle_Pain.enabled) {
				try {
					globals.Health.Effects.SevereMusclePain.GymEffectivity = 0.75
				} catch (error) {
					logger.warning("\nOtherTweaks.Allow_Gym_Training_With_Muscle_Pain failed. Send bug report. Continue safely.")
					log(error)
				}
			}

			if (config.OtherTweaks.Bigger_Hideout_Containers.enabled) {
				try {
					tables.templates.items["5aafbcd986f7745e590fff23"]._props.Grids[0]._props.cellsH = 10 // Medicine case 7x7
					tables.templates.items["5aafbcd986f7745e590fff23"]._props.Grids[0]._props.cellsV = 10

					tables.templates.items["5c093db286f7740a1b2617e3"]._props.Grids[0]._props.cellsH = 10 // Mr. Holodilnick thermal bag 8x8
					tables.templates.items["5c093db286f7740a1b2617e3"]._props.Grids[0]._props.cellsV = 10

					tables.templates.items["5c127c4486f7745625356c13"]._props.Grids[0]._props.cellsH = 10 // Magazine case 7x7
					tables.templates.items["5c127c4486f7745625356c13"]._props.Grids[0]._props.cellsV = 7

					tables.templates.items["59fb042886f7746c5005a7b2"]._props.Grids[0]._props.cellsH = 10 // Item case 8x8
					tables.templates.items["59fb042886f7746c5005a7b2"]._props.Grids[0]._props.cellsV = 10

					tables.templates.items["59fb023c86f7746d0d4b423c"]._props.Grids[0]._props.cellsH = 6 // Weapon case 5x10
					tables.templates.items["59fb023c86f7746d0d4b423c"]._props.Grids[0]._props.cellsV = 10
				} catch (error) {
					logger.warning("\nOtherTweaks.Bigger_Hideout_Containers failed. Send bug report. Continue safely.")
					log(error)
				}
			}

			if (config.OtherTweaks.Remove_Discard_Limit.enabled) {
				try {
					for (const i in items) {
						const item = items[i]
						if (item._type == "Item") {
							if (item?._props?.DiscardLimit != undefined) {
								item._props.DiscardLimit = -1
							}
						}
					}
				} catch (error) {
					logger.warning("\nOtherTweaks.Remove_Discard_Limit failed. Send bug report. Continue safely.")
					log(error)
				}
			}

			if (config.OtherTweaks.Signal_Pistol_In_Special_Slots.enabled) {
				try {
					items["627a4e6b255f7527fb05a0f6"]._props.Slots.forEach((x) => x._props.filters[0].Filter.push("620109578d82e67e7911abf2"))
				} catch (error) {
					logger.warning("OtherTweaks.Signal_Pistol_In_Special_Slots failed bacause of the other mod. Send bug report. Continue safely.")
					log(error)
				}
			}

			if (config.OtherTweaks.Unexamined_Items_Are_Back_and_Faster_Examine_Time.enabled) {
				try {
					for (const itemID in items) {
						const item = items[itemID]
						// no armor plates and mags
						if (
							item?._props?.ExaminedByDefault == true &&
							item?._parent != "65649eb40bf0ed77b8044453" &&
							item?._parent != "5448bc234bdc2d3c308b4569" &&
							item?._parent != "610720f290b75a49ff2e5e25"
						) {
							item._props.ExaminedByDefault = false
						}
						if (item?._props?.ExamineTime != undefined) {
							item._props.ExamineTime = 0.2
						}
					}
				} catch (error) {
					logger.warning("\nOtherTweaks.Unexamined_Items_Are_Back_and_Faster_Examine_Time failed bacause of the other mod. Send bug report. Continue safely.")
					log(error)
				}
			}

			if (config.OtherTweaks.Bigger_Ammo_Stacks.enabled) {
				try {
					for (const itemID in items) {
						const item = items[itemID]
						if (item?._parent == "5485a8684bdc2da71d8b4567" && item?._props?.StackMaxSize != undefined) {
							item._props.StackMaxSize *= 10
						}
					}
				} catch (error) {
					logger.warning("\nOtherTweaks.Bigger_Ammo_Stacks failed bacause of the other mod. Send bug report. Continue safely.")
					log(error)
				}
			}

			if (config.OtherTweaks.Remove_Backpack_Restrictions.enabled) {
				// Remove backpack restrictions (for containers [ammo, med, etc] mostly).
				// Never again I'll see an unlootable medcase in 314...
				for (const itemID in items) {
					const item = items[itemID]
					if (item._type == "Item") {
						if (JSON.stringify(item).indexOf("ExcludedFilter") > -1) {
							// JS safety tricks strike again.
							// console.log("Key Found");
							// log(getItemName(item._id))
							let filtered
							try {
								// Safety level 2
								filtered = item._props?.Grids[0]?._props?.filters[0]?.ExcludedFilter
								if (filtered && filtered.includes("5aafbcd986f7745e590fff23")) {
									// log(getItemName(item._id))
									item._props.Grids[0]._props.filters[0].ExcludedFilter = []
								}
							} catch (error) {
								logger.warning("\nOtherTweaks.Remove_Backpack_Restrictions failed bacause of the other mod. Send bug report. Continue safely.")
								logger.warning(itemID)
								// log(error)
							}
						}
					}
				}
			}

			if (config.OtherTweaks.Keytool_Buff.enabled) {
				// Other opinionated tweaks:
				// keytool buff to make it 5x5
				tables.templates.items["59fafd4b86f7745ca07e1232"]._props.Grids[0]._props.cellsH = 5
				tables.templates.items["59fafd4b86f7745ca07e1232"]._props.Grids[0]._props.cellsV = 5
			}

			if (config.OtherTweaks.SICC_Case_Buff.enabled) {
				// Huge buff to SICC case to make it actually not shit and a direct upgrade to Docs. And while we are here, allow it to hold keytool. It's Softcore, who cares.

				try {
					const mergeFilters = [
						...new Set([
							...tables.templates.items["590c60fc86f77412b13fddcf"]._props.Grids[0]._props.filters[0].Filter, // Docs
							...tables.templates.items["5d235bb686f77443f4331278"]._props.Grids[0]._props.filters[0].Filter, // SICC
							"59fafd4b86f7745ca07e1232", // keytool
						]),
					]
					tables.templates.items["5d235bb686f77443f4331278"]._props.Grids[0]._props.filters[0].Filter = mergeFilters
				} catch (error) {
					logger.warning(
						"\nOtherTweaks.SICC_Case_Buff failed bacause of the other mod removed default item filter property (like Valens AIO or SVM). Now SICC case allows all items. Send bug report. Continue safely."
					)
				} // log(mergeFilters.map((x) => getItemName(x)))
			}

			if (config.OtherTweaks.Reshala_Always_Has_GoldenTT.enabled) {
				// Reshala always has his Golden TT
				tables.bots.types.bossbully.chances.equipment.Holster = 100
				tables.bots.types.bossbully.inventory.equipment.Holster = { "5b3b713c5acfc4330140bd8d": 1 }
			}

			// if (config.OtherTweaks.Bosses_Have_Labs_Keycard.enabled) {
			// 	tables.bots.types.bossboar.inventory.items.SpecialLoot["5c94bbff86f7747ee735c08f"] = 1
			// 	tables.bots.types.bossbully.inventory.items.SpecialLoot["5c94bbff86f7747ee735c08f"] = 1
			// 	tables.bots.types.bosskilla.inventory.items.SpecialLoot["5c94bbff86f7747ee735c08f"] = 1
			// 	tables.bots.types.bossknight.inventory.items.SpecialLoot["5c94bbff86f7747ee735c08f"] = 1
			// 	tables.bots.types.bosssanitar.inventory.items.SpecialLoot["5c94bbff86f7747ee735c08f"] = 1
			// 	tables.bots.types.bosstagilla.inventory.items.SpecialLoot["5c94bbff86f7747ee735c08f"] = 1
			// 	tables.bots.types.bosszryachiy.inventory.items.SpecialLoot["5c94bbff86f7747ee735c08f"] = 1
			// }
		}

		if (config.InsuranceChanges.enabled) {
			// Redo insurance. Prapor in an instant return with 50% chance, costs 10% of item value, Therapist has 2 hour return with 80% chance, costs 20%.
			try {
				prapor.base.insurance.min_return_hour = 0
				prapor.base.insurance.max_return_hour = 0
				prapor.base.insurance.max_storage_time = 720
				therapist.base.insurance.min_return_hour = 0
				therapist.base.insurance.max_return_hour = 0
				therapist.base.insurance.max_storage_time = 720
				insuranceConfig.insuranceMultiplier["54cb50c76803fa8b248b4571"] = 0.3
				insuranceConfig.insuranceMultiplier["54cb57776803fa99248b456e"] = 0.05
				insuranceConfig.returnChancePercent["54cb50c76803fa8b248b4571"] = 80
				insuranceConfig.returnChancePercent["54cb57776803fa99248b456e"] = 60
			} catch (error) {
				logger.warning("\nInsuranceChanges failed. Send bug report. Continue safely.")
				log(error)
			}
		}

		if (config.EconomyOptions.enabled) {
			// Ragfair changes:
			if (config.EconomyOptions.Disable_Flea_Market_Completely.disable) {
				try {
					globals.RagFair.minUserLevel = 99
				} catch (error) {
					logger.warning("\nEconomyOptions.Disable_Flea_Market_Completely failed. Send bug report. Continue safely.")
					log(error)
				}
			} else {
				try {
					globals.RagFair.minUserLevel = config.EconomyOptions.Fleamarket_Opened_at_Level.value
				} catch (error) {
					logger.warning("\nEconomyOptions.Fleamarket_Opened_at_Level failed. Send bug report. Continue safely.")
					log(error)
				}

				if (config.EconomyOptions.Price_Rebalance.Item_Fixes) {
					try {
						// Hardcode fix for important or unbalanced items. Too low prices can't convert to barters.
						tables.templates.handbook.Items.find((x) => x.Id == "5aa2b923e5b5b000137b7589").Price *= 5 // Round frame sunglasses
						tables.templates.handbook.Items.find((x) => x.Id == "5656eb674bdc2d35148b457c").Price *= 5 // 40mm VOG-25 grenade
						tables.templates.handbook.Items.find((x) => x.Id == "59e770b986f7742cbd762754").Price *= 2 // Anti-fragmentation glasses
						tables.templates.handbook.Items.find((x) => x.Id == "5f5e45cc5021ce62144be7aa").Price *= 2 // LolKek 3F Transfer tourist backpack
						tables.templates.handbook.Items.find((x) => x.Id == "5751487e245977207e26a315").Price = 1500 // Emelya
						tables.templates.handbook.Items.find((x) => x.Id == "57347d3d245977448f7b7f61").Price = 2000 // Croutons
						tables.templates.handbook.Items.find((x) => x.Id == "5c12613b86f7743bbe2c3f76").Price = 588000
						tables.templates.handbook.Items.find((x) => x.Id == "62a0a16d0b9d3c46de5b6e97").Price = 224400
					} catch (error) {
						logger.warning("\nEconomyOptions.Price_Rebalance.Item_Fixes failed. Send bug report. Continue safely.")
						log(error)
					}
				}

				// Change all Flea prices to handbook prices.

				if (config.EconomyOptions.Price_Rebalance.enabled) {
					try {
						for (const handbookItem in tables.templates.handbook.Items) {
							const itemInHandbook = tables.templates.handbook.Items[handbookItem]
							const itemID = itemInHandbook.Id

							prices[itemID] = itemInHandbook.Price

							if (
								(!fleaListingsWhitelist.includes(itemInHandbook.ParentId) && config.EconomyOptions.Pacifist_FleaMarket.enabled) ||
								items[itemID]._props.QuestItem
							) {
								// Ban everything on flea except whitelist handbook categories above.
								ragfairConfig.dynamic.blacklist.custom.push(itemID) // Better semantics then CanSellOnRagfair
								// items[itemID]._props.CanSellOnRagfair = false
							}
						}
					} catch (error) {
						logger.warning("\nEconomyOptions.Price_Rebalance and Pacifist_FleaMarket failed. Send bug report. Continue safely.")
						log(error)
					}
				}

				try {
					// Unban random spawn only quest keys from flea, make them 2x expensive
					if (config.EconomyOptions.Pacifist_FleaMarket.Enable_QuestKeys.enabled) {
						for (const questKey of fleaItemsWhiteList.questKeys) {
							prices[questKey] *= config.EconomyOptions.Pacifist_FleaMarket.Enable_QuestKeys.PriceMultiplier
							ragfairConfig.dynamic.blacklist.custom = ragfairConfig.dynamic.blacklist.custom.filter((x) => x != items[questKey]._id) // Better semantics then CanSellOnRagfair
							// items[questKey]._props.CanSellOnRagfair = true
						}
					}
				} catch (error) {
					logger.warning("\nEconomyOptions.Pacifist_FleaMarket.Enable_QuestKeys failed. Send bug report. Continue safely.")
					log(error)
				}

				try {
					if (config.EconomyOptions.Pacifist_FleaMarket.Enable_Whitelist.enabled) {
						// Unban whitelist
						for (const item of fleaItemsWhiteList.itemWhitelist) {
							ragfairConfig.dynamic.blacklist.custom = ragfairConfig.dynamic.blacklist.custom.filter((x) => x != items[item]._id) // Better semantics then CanSellOnRagfair
							// items[item]._props.CanSellOnRagfair = true
						}
					}
				} catch (error) {
					logger.warning("\nEconomyOptions.Pacifist_FleaMarket.Enable_Whitelist failed. Send bug report. Continue safely.")
					log(error)
				}

				try {
					if (config.EconomyOptions.Pacifist_FleaMarket.Enable_Marked_Keys.enabled) {
						// Unban whitelist
						for (const markedKey of fleaItemsWhiteList.markedKeys) {
							prices[markedKey] *= config.EconomyOptions.Pacifist_FleaMarket.Enable_Marked_Keys.PriceMultiplier
							ragfairConfig.dynamic.blacklist.custom = ragfairConfig.dynamic.blacklist.custom.filter((x) => x != items[markedKey]._id) // Better semantics then CanSellOnRagfair
							// items[item]._props.CanSellOnRagfair = true
						}
					}
				} catch (error) {
					logger.warning("\nEconomyOptions.Pacifist_FleaMarket.Enable_Marked_Keys failed. Send bug report. Continue safely.")
					log(error)
				}

				try {
					if (config.EconomyOptions.Disable_Selling_on_Flea.sellingDisabled == true) {
						ragfairConfig.sell.chance.base = 0
						// ragfairConfig.sell.time.base = 20
						// ragfairConfig.sell.time.min = 10
						// ragfairConfig.sell.time.max = 30
					} else {
						// ragfairConfig.sell.reputation.gain *= 10
						// ragfairConfig.sell.reputation.loss *= 10
					}
				} catch (error) {
					logger.warning("\nEconomyOptions.Disable_Selling_on_Flea failed. Send bug report. Continue safely.")
					log(error)
				}

				try {
					// Sligtly increase flea prices, but with bigger variance, you still get a lot of great trades. Hustle.
					ragfairConfig.dynamic.priceRanges.default.min *= config.EconomyOptions.Flea_Prices_Increased.multiplier // 0.8 -> 1.04
					ragfairConfig.dynamic.priceRanges.default.max *= config.EconomyOptions.Flea_Prices_Increased.multiplier // 1.2 -> 1.56
				} catch (error) {
					logger.warning("\nSetting ragfairConfig.dynamic.price.min/max failed. Send bug report. Continue safely.")
					log(error)
				}

				try {
					if (config.EconomyOptions.Flea_Pristine_Items.enabled == true) {
						// Only pristine items are offered on flea.
						Object.values(ragfairConfig.dynamic.condition).forEach((x) => (x.min = 1)) // ._.
					}
				} catch (error) {
					logger.warning("\nEconomyOptions.Flea_Pristine_Items failed (most likely SVM). Send bug report. Continue safely.")
					log(error)
				}

				if (config.EconomyOptions.Only_Found_In_Raid_Items_Allowed_For_Barters.enabled == true) {
					//Allow FIR only items for barters. This is default, so just in case. To make a point.
					globals.RagFair.isOnlyFoundInRaidAllowed = true
				} else {
					globals.RagFair.isOnlyFoundInRaidAllowed = false
				}

				if (config.EconomyOptions.Barter_Economy.enabled == true) {
					try {
						// Can only barter from items not in the blacklist. Only allows base classes, and not itemIDs =(
						// To diable barter requests for individual item, its flea price should be set to 2, like in the code below.
						ragfairConfig.dynamic.barter.itemTypeBlacklist = fleaBarterRequestBlacklist

						ragfairConfig.dynamic.barter.chancePercent = 100 - config.EconomyOptions.Barter_Economy.Cash_Offers_Percentage.value // Allow 10% of listings for cash
						ragfairConfig.dynamic.barter.minRoubleCostToBecomeBarter = 100 // Barters only for items that cost > 100
						ragfairConfig.dynamic.barter.priceRangeVariancePercent = config.EconomyOptions.Barter_Economy.Barter_Price_Variance.value // more variance for flea barters, seems actually fun!

						// Max 2 for 1 barters.
						ragfairConfig.dynamic.barter.itemCountMax = config.EconomyOptions.Barter_Economy.itemCountMax.value

						BSGblacklist.filter((x) => {
							// dirty hack to block BSG blacklisted items (dogtags, bitcoins, ornaments and others) from barters, since you can't buy them on flea anyway, so it should not matter.
							if (x == "59faff1d86f7746c51718c9c" && config.EconomyOptions.Barter_Economy.Unban_Bitcoins_For_Barters.enabled == true) {
								// do nothing
							} else if (!fleaBarterRequestBlacklist.includes(items[x]._parent)) {
								// Only mod items in categories ALLOWED on flea request list
								// Actually, I could have just hardcoded this lol. By default it's just Cristmass ornaments, dogtags and bitcoins.
								// 2 is used to pass getFleaPriceForItem check and not trigger generateStaticPrices

								// prices[x] *= 100

								// log(`ItemItem ${getItemName(x)}, ${prices[x]}`)
								// log(`prices["${x}"] = 2 // ${getItemName(x)}, ${prices[x]}`)
								prices["614451b71e5874611e2c7ae5"] = 2 // Bottle of Tarkovskaya vodka, 25000
								// prices["6389c92d52123d5dd17f8876"] = 2 // Advanced Electronic Materials textbook, 490000
								// prices["6389c8fb46b54c634724d847"] = 2 // Silicon Optoelectronic Integrated Circuits textbook, 500000
								// prices["64d0b40fbe2eed70e254e2d4"] = 2 // Sacred Amulet, 100000
								prices["6389c7f115805221fb410466"] = 2680970 // Far-forward GPS Signal Amplifier Unit, 120000
								prices["6389c85357baa773a825b356"] = 6648292 // Advanced current converter, 300000
								prices["5df8a77486f77412672a1e3f"] = 2 // Christmas tree ornament (Violet), 20000
								prices["59f32c3b86f77472a31742f0"] = 2 // Dogtag USEC, 600
								prices["6389c7750ef44505c87f5996"] = 1566360 // Microcontroller board, 100000
								prices["5df8a72c86f77412640e2e83"] = 2 // Christmas tree ornament (Silver), 10000
								prices["5df8a6a186f77412640e2e80"] = 2 // Christmas tree ornament (Red), 7000
								prices["59f32bb586f774757e1e8442"] = 2 // Dogtag BEAR, 600

								if (items[x]._props.CanSellOnRagfair == true) {
									logger.warning(
										`\nItem ${getItemName(x)} can be bought on flea for free, don't use BSG blacklist removals with EconomyOptions.Barter_Economy.enabled!`
									)
								}
							}
						})

						// Proper fix for quest items appearing in barter requests
						Object.keys(prices)
							.filter((x) => items[x]?._props?.QuestItem == true)
							.forEach((x) => (prices[x] = 2))

						// Max 20 offers. Too low of a number breaks AKI server for some reason, with constant client errors on completed trades.
						// More random trades variance anyway, this is fun.
						ragfairConfig.dynamic.offerItemCount.min = config.EconomyOptions.Barter_Economy.offerItemCount.min
						ragfairConfig.dynamic.offerItemCount.max = config.EconomyOptions.Barter_Economy.offerItemCount.max

						// Max 2 items per offer. Feels nice. Loot more shit, it might come in handy.
						ragfairConfig.dynamic.nonStackableCount.min = config.EconomyOptions.Barter_Economy.nonStackableCount.min
						ragfairConfig.dynamic.nonStackableCount.max = config.EconomyOptions.Barter_Economy.nonStackableCount.max
					} catch (error) {
						logger.warning("\nEconomyOptions.Barter_Economy failed. Send bug report. Continue safely.")
						log(error)
					}
				}
			}
		}

		if (config.TraderChanges.enabled) {
			if (config.TraderChanges.Better_Sales_To_Traders.enabled) {
				if (debug) {
					for (const trader in traderlist) {
						log(`${traderlist[trader].base.nickname}.base.items_buy = {`)
						log('"category": [')
						traderlist[trader].base.items_buy.category.forEach((x) => log(`"${x}", // ${getItemName(x)}`))
						log("],")
						log('"id_list": [')
						traderlist[trader].base.items_buy.id_list.forEach((x) => log(`"${x}", // ${getItemName(x)}`))
						log("]}")
					}
				}
				if (debug) {
					for (const trader in traderlist) {
						log(`${traderlist[trader].base.nickname}.base.sell_category = [`)
						traderlist[trader].base.sell_category.forEach((x) => log(`"${x}", // ${locales["en"][x]}`))
						// traderlist[trader].base.sell_category.forEach((x) => log(locales["en"][`${x}`]))
						log("]")
					}
					//
					for (const trader in traderlist) {
						log(`${traderlist[trader].base.nickname}: ${100 - traderlist[trader].base.loyaltyLevels[3].buy_price_coef}%`)
					}
				}

				try {
					for (const trader in traderlist) {
						traderlist[trader].base.loyaltyLevels[0].buy_price_coef = 35
						traderlist[trader].base.loyaltyLevels[1].buy_price_coef = 30
						traderlist[trader].base.loyaltyLevels[2].buy_price_coef = 25
						traderlist[trader].base.loyaltyLevels[3].buy_price_coef = 20
					}

					peacekeeper.base.loyaltyLevels.forEach((x) => (x.buy_price_coef += 7))
					skier.base.loyaltyLevels.forEach((x) => (x.buy_price_coef += 6))
					prapor.base.loyaltyLevels.forEach((x) => (x.buy_price_coef += 5))
					mechanic.base.loyaltyLevels.forEach((x) => (x.buy_price_coef += 4))
					jaeger.base.loyaltyLevels.forEach((x) => (x.buy_price_coef += 3))
					ragman.base.loyaltyLevels.forEach((x) => (x.buy_price_coef += 2))
					therapist.base.loyaltyLevels.forEach((x) => (x.buy_price_coef += 1))
				} catch (error) {
					logger.warning("\nTraderChanges.BetterSalesToTraders failed. Send bug report. Continue safely.")
					log(error)
				}
			}

			if (config.TraderChanges.Alternative_Categories.enabled) {
				try {
					therapist.base.items_buy.category = [
						"543be5664bdc2dd4348b4569", // Meds
						"543be6674bdc2df1348b4569", // Food and drink
						"567849dd4bdc2d150f8b456e", // Map
						"543be5e94bdc2df1348b4568", // Key
						// "5448eb774bdc2d0a728b4567", // Barter item
						"5795f317245977243854e041", // Common container
						// new:
						"57864c8c245977548867e7f1", // Medical supplies
						"57864c322459775490116fbf", // HouseholdGoods
					]

					ragman.base.items_buy.category.push("57864a3d24597754843f8721") // Ragman buys Jewelry and Valuables
					skier.base.items_buy.category.push("5448ecbe4bdc2d60728b4568") // Skier buys info items
				} catch (error) {
					logger.warning("\nTraderChanges.AlternativeCategories failed. Send bug report. Continue safely.")
					log(error)
				}
			}

			if (config.TraderChanges.Skier_Uses_Euros.enabled) {
				try {
					// WIP
					skier.base.currency = "EUR"
					skier.base.balance_eur = 700000
					skier.base.loyaltyLevels.forEach((x) => (x.minSalesSum = Math.round(x.minSalesSum / euroPrice)))

					for (const barter in skier.assort.barter_scheme) {
						if (skier.assort.barter_scheme[barter][0][0]._tpl == "5449016a4bdc2d6f028b456f" && barter != "63d385b6b3eba6c95d0eee0c") {
							skier.assort.barter_scheme[barter][0][0].count = roundWithPrecision(skier.assort.barter_scheme[barter][0][0].count / euroPrice, 2)
							skier.assort.barter_scheme[barter][0][0]._tpl = "569668774bdc2da2298b4568"
						}
					}

					for (const i in tables.templates.quests) {
						const quest = tables.templates.quests[i]
						if (quest.traderId == "58330581ace78e27b8b10cee") {
							for (const rewards of quest.rewards.Success) {
								if (rewards.items) {
									for (const item of rewards.items) {
										if (item._tpl == "5449016a4bdc2d6f028b456f") {
											rewards.value = Math.round(rewards.value / euroPrice)
											item._tpl = "569668774bdc2da2298b4568"
											item.upd.StackObjectsCount = Math.round(item.upd.StackObjectsCount / euroPrice)
										}
									}
								}
							}
						}
					}
				} catch (error) {
					logger.warning("\nTraderChanges.SkierUsesEuros failed. Send bug report. Continue safely.")
					log(error)
				}
			}

			if (config.TraderChanges.Reasonably_Priced_Cases.enabled == true) {
				try {
					therapist.assort.barter_scheme["65cb82567e8e8aec5b088dc7"][0].forEach((x) => (x.count = 5)) // T H I C C item case (LEDX) 5c0a840b86f7742ffa4f2482
					therapist.assort.barter_scheme["65cb82577e8e8aec5b088e06"][0].forEach((x) => (x.count = 10)) // T H I C C item case (Moonshine)5c0a840b86f7742ffa4f2482
					therapist.assort.barter_scheme["65cb82567e8e8aec5b088d88"][0].forEach((x) => (x.count = 7256)) // Item case (Euro) 13839 59fb042886f7746c5005a7b2
					therapist.assort.barter_scheme["65cb82567e8e8aec5b088db2"][0].forEach((x) => (x.count = 8)) // Item case (OScope) 59fb042886f7746c5005a7b2
					therapist.assort.barter_scheme["65cb82577e8e8aec5b088e00"][0].forEach((x) => (x.count = 30)) // Item case (Dogtags) 59fb042886f7746c5005a7b2
					therapist.assort.barter_scheme["65cb82577e8e8aec5b088e03"][0].forEach((x) => (x.count = 30)) // Lucky Scav Junk box (Dogtags) 5b7c710788a4506dec015957
					therapist.assort.barter_scheme["65cb82567e8e8aec5b088dc1"][0].forEach((x) => (x.count = 961138)) // Lucky Scav Junk box (Rubles) 1106138 5b7c710788a4506dec015957
					therapist.assort.barter_scheme["65cb82567e8e8aec5b088dca"][0].forEach((x) => (x.count = 290610)) // Medcase (Rubles) 5aafbcd986f7745e590fff23
					therapist.assort.barter_scheme["65cb82577e8e8aec5b088e18"][0].forEach((x) => (x.count /= 30)) // LEDX (Dogtags) // Really BSG? 160 kills for a non-FIR item? REALLY?! 5c0530ee86f774697952d952

					peacekeeper.assort.barter_scheme["6492e44bf4287b13040fca51"][0].forEach((x) => (x.count = Math.round(x.count / 5 + 1))) // THICC case (SMT+Bluefolder) 5c0a840b86f7742ffa4f2482

					skier.assort.barter_scheme["65cb81e7321bfcd99d00fbdd"][0].forEach((x) => (x.count = 4)) // Weapon case (Moonshine) 59fb023c86f7746d0d4b423c

					mechanic.assort.barter_scheme["65cb82277e8e8aec5b08778c"][0].forEach((x) => (x.count = 5)) // Weapon case (Bitcoins) 59fb023c86f7746d0d4b423c
					mechanic.assort.barter_scheme["65cb82277e8e8aec5b087734"][0].forEach((x) => (x.count = 10)) // THICC Weapon case (Bitcoins) 5b6d9ce188a4501afc1b2b25
					jaeger.assort.barter_scheme["65cb821d7e8e8aec5b0872e1"][0].forEach((x) => (x.count = 5)) // Red Rebel Icepick 5c0126f40db834002a125382
				} catch (error) {
					logger.warning("\nTraderChanges.Reasonably_Priced_Cases failed. Send bug report. Continue safely.")
					log(error)
				}
			}

			if (config.TraderChanges.Bigger_Limits.enabled == true) {
				try {
					// mark

					for (const trader in traderlist) {
						for (const item in traderlist[trader].assort.items) {
							// log(traderlist[trader].assort.items[item])
							if (traderlist[trader].assort.items[item]?.upd?.BuyRestrictionMax) {
								traderlist[trader].assort.items[item].upd.BuyRestrictionMax *= config.TraderChanges.Bigger_Limits.Limit_Multiplier
							}
						}
					}
				} catch (error) {
					logger.warning("\nTraderChanges.Bigger_Limits failed. Send bug report. Continue safely.")
					log(error)
				}
			}

			if (config.TraderChanges.Pacifist_Fence.enabled == true) {
				try {
					// Add BSGblacklist and mod custom blacklist to Fence blacklists
					let fenceBlacklist = traderConfig.fence.blacklist

					// In addition to other blacklists, no medikits, medical items and drugs for Fence, because he sells them not in pristine condition.

					fenceBlacklist.push(
						...BSGblacklist,
						...fleaBarterRequestBlacklist
						// "5448f39d4bdc2d0a728b4568",
						// "5448f3ac4bdc2dce718b4569", // W T F, dupes mb?
						// "5448f3a14bdc2d27728b4569",
					)
					// log(fenceBlacklist)
					// Instead, allow him to sell stims!
					// fenceBlacklist = fenceBlacklist.filter((x) => x != "5448f3a64bdc2d60728b456a")

					// fenceBlacklist = fenceBlacklist.filter(onlyUnique)
					// fenceBlacklist = fenceBlacklist.filter((x) => x == "5af0454c86f7746bf20992e8")
					// log(fenceBlacklist)
					// Fence sells only items that are not in the flea blacklist
					traderConfig.fence.assortSize = config.TraderChanges.Pacifist_Fence.Number_Of_Fence_Offers
					traderConfig.fence.blacklist = fenceBlacklist //itemid or baseid
					traderConfig.fence.equipmentPresetMinMax.min = 0
					traderConfig.fence.equipmentPresetMinMax.max = 0
					traderConfig.fence.weaponPresetMinMax.min = 0
					traderConfig.fence.weaponPresetMinMax.max = 0
					traderConfig.fence.discountOptions.assortSize = config.TraderChanges.Pacifist_Fence.Number_Of_Fence_Offers * 2
					traderConfig.fence.itemPriceMult = 1
					traderConfig.fence.discountOptions.itemPriceMult = 0.82 // This Fence settings are weird. I still don't get how AKI calculates assorts, was getting very strange results in testing. But this should be close enough to best trader prices but not abusable.
					traderConfig.fence.discountOptions.weaponPresetMinMax.min = 0
					traderConfig.fence.discountOptions.weaponPresetMinMax.max = 0
					traderConfig.fence.discountOptions.equipmentPresetMinMax.min = 0
					traderConfig.fence.discountOptions.equipmentPresetMinMax.max = 0
					// ragfairConfig.traders["579dc571d53a0658a154fbec"] = true // test
				} catch (error) {
					logger.warning("\nTraderChanges.Pacifist_Fence failed. Send bug report. Continue safely.")
					log(error)
				}
			}
		}

		if (config.CraftingRebalance.enabled == true) {
			// Crafts:
			// This here, is some dumb stuff, I should've created some special class, controller, pushed the data out of the code or some other OOP bullcrap, but I'm not a programmer, so this will have to suffice. Sorry, not sorry.

			try {
				// ------
				// Lavatory:
				// ------
				// Toilet paper production nerf lol. Who would have thought this craft would be OP, huh?
				getCraft("5c13cef886f774072e618e82").count = 1

				// 2x Clin production buff
				getCraft("59e358a886f7741776641ac3").count = 2

				// 2x Paracord production buff
				getCraft("5c12688486f77426843c7d32").count = 2

				// Corrugated hose buff // 59e35cbb86f7741778269d83
				getCraft("59e35cbb86f7741778269d83").requirements.forEach((x) => {
					if (x.count) {
						x.count = 1
					}
				})
				getCraft("59e35cbb86f7741778269d83").count = 1

				// Water filter 4 -> 2 airfilter craft buff
				getCraft("5d1b385e86f774252167b98a").requirements.find((x) => x.templateId == "590c595c86f7747884343ad7").count = 2

				// MPPV buff (KEKTAPE duct tape 2 -> 1)
				// 380 // getCraft("5df8a42886f77412640e2e75").requirements.find((x) => x.templateId == "5e2af29386f7746d4159f077").count = 1

				// ------
				// Nutrition unit:
				// ------

				// EWR buff
				getCraft("60098b1705871270cd5352a1").count = 3

				// coffee buff (2 -> 3)
				getCraft("5af0484c86f7740f02001f7f").count = 3

				// bottled water buff water (8 -> 16)
				getCraft("5448fee04bdc2dbc018b4567").count = 16

				// Aquamari buff (3 -> 5)
				// getCraft("5c0fa877d174af02a012e1cf").count = 5

				// ------
				// Medstation:
				// ------

				// Buff MULE
				getCraft("5ed51652f6c34d2cc26336a1").count = 2

				// Buff eTG
				getCraft("5c0e534186f7747fa1419867").count = 2
				getCraft("5c0e534186f7747fa1419867").requirements.find((x) => x.templateId == "5c0e530286f7747fa1419862").count = 2

				// Buff CALOK
				getCraft("5e8488fa988a8701445df1e4").count = 2
				getCraft("5e8488fa988a8701445df1e4").requirements.find((x) => x.templateId == "5e8488fa988a8701445df1e4").count = 2

				// AFAK buff
				getCraft("60098ad7c2240c0fe85c570a").requirements.find((x) => x.templateId == "590c678286f77426c9660122").count = 1
				getCraft("60098ad7c2240c0fe85c570a").requirements.find((x) => x.templateId == "5751a25924597722c463c472").templateId = "5e8488fa988a8701445df1e4"

				// Portable defibrillator big nerf (Portable Powerbank 1 -> 4). Lore-friendly and still profitable, just not as ridiculous.
				getCraft("5c052e6986f7746b207bc3c9").requirements.find((x) => x.templateId == "5af0561e86f7745f5f3ad6ac").count = 4

				// LEDX buff (Huge buff, 1 of each component only). Now it is actually only sometimes bother to craft it.
				getCraft("5c0530ee86f774697952d952").requirements.forEach((x) => {
					if (x.count) {
						x.count = 1
					}
				})

				// CMS nerf (Medical tools 1 -> 2)
				getCraft("5d02778e86f774203e7dedbe").requirements.find((x) => x.templateId == "619cc01e0a7c3a1a2731940c").count = 2

				// GRIzZLY nerf (2 -> 1)
				getCraft("590c657e86f77412b013051d").count = 1

				// SJ6 buff (2 -> 3)
				getCraft("5c0e531d86f7747fa23f4d42").count = 3

				// ------
				// Intel Center:
				// ------

				// Topographic survey maps buff (1 -> 2)
				getCraft("62a0a124de7ac81993580542").count = 2

				// Military flash drive lore-based change (2 Secure Flash drive -> 1 VPX, and Topographic survey maps 2 -> 1).
				// Not "profitable", but will change Intel folder craft to compensate, and allow it to be crafted on level 2.
				getCraft("62a0a16d0b9d3c46de5b6e97").requirements.forEach((x) => {
					if (x.count) {
						x.count = 1
					}
				})
				getCraft("62a0a16d0b9d3c46de5b6e97").requirements.find((x) => x.type == "Area").requiredLevel = 2
				getCraft("62a0a16d0b9d3c46de5b6e97").requirements.find((x) => x.templateId == "590c621186f774138d11ea29").templateId = "5c05300686f7746dce784e5d"

				// Intelligence folder buff (Military flash drive 2 -> 1)
				getCraft("5c12613b86f7743bbe2c3f76").requirements.find((x) => x.templateId == "62a0a16d0b9d3c46de5b6e97").count = 1

				// VPX buff (RAM and Broken GPhone smartphone 3 -> 2)
				getCraft("5c05300686f7746dce784e5d").requirements.forEach((x) => {
					if (x.count) {
						x.count = 2
					}
				})

				// Virtex buff (Military circuit board 2 -> 1)
				getCraft("5c05308086f7746b2101e90b").requirements.find((x) => x.templateId == "5d0376a486f7747d8050965c").count = 1

				// GPU buff (3 VPX -> 1 Virtex, 10 PCB -> 1, 10 CPU -> 1)
				getCraft("57347ca924597744596b4e71").requirements.find((x) => x.templateId == "5c05300686f7746dce784e5d").count = 1
				getCraft("57347ca924597744596b4e71").requirements.find((x) => x.templateId == "5c05300686f7746dce784e5d").templateId = "5c05308086f7746b2101e90b"
				getCraft("57347ca924597744596b4e71").requirements.find((x) => x.templateId == "573477e124597737dd42e191").count = 1
				getCraft("57347ca924597744596b4e71").requirements.find((x) => x.templateId == "590a3b0486f7743954552bdb").count = 1

				// ------
				// Workbench:
				// ------

				// Military circuit board buff (1 -> 2)
				getCraft("5d0376a486f7747d8050965c").count = 2

				// FLIR huge buff (everything is 1, plus change SAS drive (wtf?!) to Armasight Vulcan MG 3.5x Bravo night vision scope)
				getCraft("5d1b5e94d7ad1a2b865a96b0").requirements.forEach((x) => {
					if (x.count) {
						x.count = 1
					}
				})
				getCraft("5d1b5e94d7ad1a2b865a96b0").requirements.find((x) => x.templateId == "590c37d286f77443be3d7827").templateId = "5b3b6e495acfc4330140bd88"

				// UHF RFID Reader huge buff (only Broken GPhone X smartphone + Signal Jammer)
				getCraft("5c052fb986f7746b2101e909").requirements = [
					{
						areaType: 11,
						requiredLevel: 2,
						type: "Area",
					},
					{
						templateId: "5c1265fc86f7743f896a21c2",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "5ac78a9b86f7741cca0bbd8d",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "5d4042a986f7743185265463",
						type: "Tool",
					},
					{
						templateId: "5d63d33b86f7746ea9275524",
						type: "Tool",
					},
				]

				// Gasan buff
				getCraft("590a3efd86f77437d351a25b").requirements.forEach((x) => {
					if (x.count) {
						x.count = 1
					}
				})

				// Hawk nerf
				getCraftID("5dd3c9c8449c0c31795b0f0b").requirements.find((x) => x.templateId == "57347b8b24597737dd42e192").templateId = "60391a8b3364dc22b04d0ce5"
				getCraftID("5dd3c9c8449c0c31795b0f0b").requirements.find((x) => x.type == "Area").requiredLevel = 2

				// Spark plug buff 1 -> 4
				getCraft("590a3c0a86f774385a33c450").count = 4

				// PCB -> counter instead of gasan, 3 PCB
				getCraftID("5ffcac4e1285295b7441ee01").count = 3
				getCraftID("5ffcac4e1285295b7441ee01").requirements.find((x) => x.templateId == "590a3efd86f77437d351a25b").templateId = "5672cb724bdc2dc2088b456b"

				// Geiger-Muller counter uses only 1 gasan at lvl1
				getCraft("5672cb724bdc2dc2088b456b").requirements = [
					{
						areaType: 10,
						requiredLevel: 1,
						type: "Area",
					},
					{
						templateId: "590a3efd86f77437d351a25b",
						count: 1,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "590c2e1186f77425357b6124",
						type: "Tool",
					},
				]

				// GreenBat
				getCraft("5e2aedd986f7746d404f3aa4").count = 2
				getCraft("5e2aedd986f7746d404f3aa4").requirements = [
					{
						areaType: 10,
						requiredLevel: 2,
						type: "Area",
					},
					{
						templateId: "5af0561e86f7745f5f3ad6ac",
						count: 1,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5d1b31ce86f7742523398394",
						type: "Tool",
					},
				]

				// VOG-25 Khattabka improvised hand grenade
				getCraft("5e340dcdcb6d5863cc5e5efb").requirements.forEach((x) => {
					if (x.count) {
						x.count = 2
					}
				})

				// 23x75mm "Zvezda" flashbang round
				getCraft("5e85a9f4add9fe03027d9bf1").count = 20
				getCraft("5e85a9f4add9fe03027d9bf1").requirements = [
					{
						areaType: 10,
						requiredLevel: 2,
						type: "Area",
					},
					{
						templateId: "5d6fc78386f77449d825f9dc",
						count: 1,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5e85a9a6eacf8c039e4e2ac1",
						count: 20,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5a0c27731526d80618476ac4",
						count: 2,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "590c2e1186f77425357b6124",
						type: "Tool",
					},
					{
						templateId: "544fb5454bdc2df8738b456a",
						type: "Tool",
					},
				]

				// Rechargeable battery buff, Portable Powerbank -> Electric drill
				getCraft("590a358486f77429692b2790").requirements.find((x) => x.templateId == "5af0561e86f7745f5f3ad6ac").templateId = "59e35de086f7741778269d84"

				// Thermite buff
				getCraft("60391a8b3364dc22b04d0ce5").requirements.find((x) => x.templateId == "5780cf722459777a5108b9a1").templateId = "57e26ea924597715ca604a09"

				//// AMMO ////
				// 9x19mm AP 6.3
				// 380 // getCraft("5c925fa22e221601da359b7b").requirements.find((x) => x.templateId == "5d6fc87386f77449db3db94e").count = 1
				// 380 // getCraft("5c925fa22e221601da359b7b").requirements.find((x) => x.templateId == "5d6fc87386f77449db3db94e").templateId = "5d6fc78386f77449d825f9dc"

				// "5efb0da7a29a85116f6ea05f", // 9x19mm PBP gzh
				getCraft("5efb0da7a29a85116f6ea05f").requirements = [
					{
						areaType: 10,
						requiredLevel: 3,
						type: "Area",
					},
					{
						templateId: "5c925fa22e221601da359b7b",
						count: 200,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5d6fc87386f77449db3db94e",
						count: 1,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "590c2e1186f77425357b6124",
						type: "Tool",
					},
				]

				// .45 ACP AP buff
				getCraft("5efb0cabfb3e451d70735af5").count = 120
				getCraft("5efb0cabfb3e451d70735af5").requirements = [
					{
						areaType: 10,
						requiredLevel: 2,
						type: "Area",
					},
					{
						templateId: "5efb0d4f4bc50b58e81710f3",
						count: 120,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "544fb5454bdc2df8738b456a",
						type: "Tool",
					},
					{
						templateId: "5d6fc78386f77449d825f9dc",
						count: 1,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "590c31c586f774245e3141b2",
						count: 1,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "62a0a0bb621468534a797ad5",
						type: "Tool",
					},
				]

				// 5.7x28mm SS190 buff
				getCraft("5cc80f38e4a949001152b560").requirements = [
					{
						areaType: 10,
						requiredLevel: 2,
						type: "Area",
					},
					{
						templateId: "5d1b317c86f7742523398392",
						type: "Tool",
					},
					{
						templateId: "5af04b6486f774195a3ebb49",
						type: "Tool",
					},
					{
						templateId: "5cc80f8fe4a949033b0224a2",
						count: 180,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5d6fc87386f77449db3db94e",
						count: 1,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "590c31c586f774245e3141b2",
						count: 2,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
				]

				// 7.62x51mm M80 buff
				/* // 380 
				getCraft("58dd3ad986f77403051cba8f").requirements = [
					{
						areaType: 10,
						requiredLevel: 3,
						type: "Area",
					},
					{
						templateId: "544fb5454bdc2df8738b456a",
						type: "Tool",
					},
					{
						templateId: "5d1b31ce86f7742523398394",
						type: "Tool",
					},
					{
						templateId: "5e023e53d4353e3302577c4c",
						count: 80,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5d6fc78386f77449d825f9dc",
						count: 2,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
				]
				*/

				// 5.56x45mm MK 318 Mod 0 (SOST)
				getCraft("60194943740c5d77f6705eea").requirements = [
					{
						areaType: 10,
						requiredLevel: 2,
						type: "Area",
					},
					{
						templateId: "59e6927d86f77411da468256",
						count: 150,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5d6fc78386f77449d825f9dc",
						count: 1,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5af04b6486f774195a3ebb49",
						type: "Tool",
					},
				]

				// "59e0d99486f7744a32234762", // 7.62x39mm BP gzh
				// getCraft("59e0d99486f7744a32234762").requirements = [
				// 	{
				// 		areaType: 10,
				// 		requiredLevel: 3,
				// 		type: "Area"
				// 	},
				// 	{
				// 		templateId: "5656d7c34bdc2d9d198b4587",
				// 		count: 120,
				// 		isFunctional: false,
				// 		isEncoded: false,
				// 		type: "Item"
				// 	},
				// 	{
				// 		templateId: "59e4d24686f7741776641ac7",
				// 		count: 120,
				// 		isFunctional: false,
				// 		isEncoded: false,
				// 		type: "Item"
				// 	},
				// 	{
				// 		templateId: "5d6fc87386f77449db3db94e",
				// 		count: 1,
				// 		isFunctional: false,
				// 		isEncoded: false,
				// 		type: "Item"
				// 	},
				// 	{
				// 		templateId: "544fb5454bdc2df8738b456a",
				// 		type: "Tool"
				// 	},
				// ]

				// "5c0d56a986f774449d5de529", // 9x19mm RIP
				getCraft("5c0d56a986f774449d5de529").requirements = [
					{
						areaType: 10,
						requiredLevel: 2,
						type: "Area",
					},
					{
						templateId: "56d59d3ad2720bdb418b4577",
						count: 180,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "57e26fc7245977162a14b800",
						count: 2,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5af04b6486f774195a3ebb49",
						type: "Tool",
					},
					{
						templateId: "63a0b208f444d32d6f03ea1e",
						type: "Tool",
					},
				]

				// "5c0d5e4486f77478390952fe", // 5.45x39mm PPBS gs "Igolnik"

				/* // 380
				getCraft("5c0d5e4486f77478390952fe").count = 120
				getCraft("5c0d5e4486f77478390952fe").requirements = [
					{
						areaType: 10,
						requiredLevel: 3,
						type: "Area",
					},
					{
						templateId: "590c5a7286f7747884343aea",
						count: 1,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5d6fc78386f77449d825f9dc",
						count: 1,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5d6fc87386f77449db3db94e",
						count: 1,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "56dff2ced2720bb4668b4567",
						count: 120,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "56dfef82d2720bbd668b4567",
						count: 120,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5d40425986f7743185265461",
						type: "Tool",
					},
					{
						templateId: "590c2b4386f77425357b6123",
						type: "Tool",
					},
				]

				// "5cadf6eeae921500134b2799", // 12.7x55mm PS12B
				getCraft("5cadf6eeae921500134b2799").count = 120

				// "59e690b686f7746c9f75e848", // 5.56x45mm M995
				getCraft("59e690b686f7746c9f75e848").count = 180
				getCraft("59e690b686f7746c9f75e848").requirements = [
					{
						areaType: 10,
						requiredLevel: 3,
						type: "Area",
					},
					{
						templateId: "5d6fc87386f77449db3db94e",
						count: 1,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "54527ac44bdc2d36668b4567",
						count: 180,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "590c2e1186f77425357b6124",
						type: "Tool",
					},
					{
						templateId: "544fb5454bdc2df8738b456a",
						type: "Tool",
					},
				]
*/
				// 9x39mm SP-6 gs
				// getCraft("57a0e5022459774d1673f889").requirements = [
				// 	{
				// 		templateId: "59e4d24686f7741776641ac7",
				// 		count: 300,
				// 		isFunctional: false,
				// 		isEncoded: false,
				// 		type: "Item"
				// 	},
				// 	{
				// 		templateId: "56d59d3ad2720bdb418b4577",
				// 		count: 300,
				// 		isFunctional: false,
				// 		isEncoded: false,
				// 		type: "Item"
				// 	},
				// 	{
				// 		templateId: "5d6fc87386f77449db3db94e",
				// 		count: 3,
				// 		isFunctional: false,
				// 		isEncoded: false,
				// 		type: "Item"
				// 	},
				// 	{
				// 		areaType: 10,
				// 		requiredLevel: 2,
				// 		type: "Area"
				// 	},
				// 	{
				// 		templateId: "590c2e1186f77425357b6124",
				// 		type: "Tool"
				// 	},
				// ]

				// "5c0d688c86f77413ae3407b2", // 9x39mm BP gs
				//				getCraft("5c0d688c86f77413ae3407b2").requirements = [
				//					{
				//						templateId: "57a0e5022459774d1673f889",
				//						count: 160,
				//						isFunctional: false,
				//						isEncoded: false,
				//						type: "Item",
				//					},
				//					{
				//						templateId: "5d6fc87386f77449db3db94e",
				//						count: 1,
				//						isFunctional: false,
				//						isEncoded: false,
				//						type: "Item",
				//					},
				//					{
				//						areaType: 10,
				//						requiredLevel: 3,
				//						type: "Area",
				//					},
				//				]

				/*
				// "5c0d668f86f7747ccb7f13b2", // 9x39mm SPP gs
				getCraft("5c0d668f86f7747ccb7f13b2").requirements = [
					{
						areaType: 10,
						requiredLevel: 3,
						type: "Area",
					},
					{
						templateId: "57a0dfb82459774d3078b56c",
						count: 200,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5efb0da7a29a85116f6ea05f",
						count: 200,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5d40425986f7743185265461",
						type: "Tool",
					},
				]
*/
				// 7.62x54mm R SNB gzh nerf lol
				// getCraft("560d61e84bdc2da74d8b4571").requirements.find((x) => x.templateId == "5887431f2459777e1612938f").templateId = "5e023d34e8a400319a28ed44"
				getCraft("560d61e84bdc2da74d8b4571").requirements.find((x) => x.type == "Area").requiredLevel = 3

				// 9x21mm BT gzh buff
				// getCraft("5a26ac0ec4a28200741e1e18")
				// 	.requirements.filter((x) => x.templateId != "5a269f97c4a282000b151807" && x.areaType == undefined)
				// 	.forEach((x) => (x.count = 1))

				// "57371aab2459775a77142f22", // 9x18mm PMM PstM gzh
				getCraft("57371aab2459775a77142f22").requirements.push({
					templateId: "5737201124597760fc4431f1",
					count: 140,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				})

				// "5d6e6806a4b936088465b17e", // 12/70 8.5mm Magnum buckshot
				// getCraft("5d6e6806a4b936088465b17e").requirements = [
				// 	{
				// 		areaType: 10,
				// 		requiredLevel: 1,
				// 		type: "Area",
				// 	},
				// 	{
				// 		templateId: "560d5e524bdc2d25448b4571",
				// 		count: 120,
				// 		isFunctional: false,
				// 		isEncoded: false,
				// 		type: "Item",
				// 	},
				// 	{
				// 		templateId: "590c5a7286f7747884343aea",
				// 		count: 1,
				// 		isFunctional: false,
				// 		isEncoded: false,
				// 		type: "Item",
				// 	},
				// ]
				// "5d6e6911a4b9361bd5780d52", // 12/70 flechette
				// getCraft("5d6e6911a4b9361bd5780d52").requirements = [
				// 	{
				// 		areaType: 10,
				// 		requiredLevel: 1,
				// 		type: "Area"
				// 	},
				// 	{
				// 		templateId: "5d1b36a186f7742523398433",
				// 		count: 1,
				// 		isFunctional: false,
				// 		isEncoded: false,
				// 		type: "Item"
				// 	},
				// 	{
				// 		templateId: "590c5a7286f7747884343aea",
				// 		count: 1,
				// 		isFunctional: false,
				// 		isEncoded: false,
				// 		type: "Item"
				// 	},
				// 	{
				// 		templateId: "5d6e6869a4b9361c140bcfde",
				// 		count: 60,
				// 		isFunctional: false,
				// 		isEncoded: false,
				// 		type: "Item"
				// 	},
				// 	{
				// 		templateId: "5d40419286f774318526545f",
				// 		type: "Tool"
				// 	},
				// 	{
				// 		templateId: "544fb5454bdc2df8738b456a",
				// 		type: "Tool"
				// 	},
				// ]

				//"5c0d591486f7744c505b416f", // 12/70 RIP
				// getCraft("5c0d591486f7744c505b416f").requirements.push({
				// 	templateId: "5d6e68dea4b9361bcc29e659",
				// 	count: 60,
				// 	isFunctional: false,
				// 	isEncoded: false,
				// 	type: "Item",
				// })

				// "5d6e68a8a4b9360b6c0d54e2", // 12/70 AP-20 armor-piercing slug
				getCraft("5d6e68a8a4b9360b6c0d54e2").requirements = [
					{
						areaType: 10,
						requiredLevel: 2,
						type: "Area",
					},
					{
						templateId: "5d6e6806a4b936088465b17e",
						count: 80,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5c925fa22e221601da359b7b",
						count: 80,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5d40425986f7743185265461",
						type: "Tool",
					},
					{
						templateId: "5d4042a986f7743185265463",
						type: "Tool",
					},
				]

				// 5.56x45mm M856A1 buff
				// getCraft("59e6906286f7746c9f75e847").requirements.find((x) => x.templateId == "5d6fc87386f77449db3db94e").count = 1

				// "5ba26835d4351e0035628ff5", // 4.6x30mm AP SX
				getCraft("5ba26835d4351e0035628ff5").requirements.forEach((x) => {
					if (x.count && x.count < 10) {
						x.count = 1
					}
				})

				// "5fd20ff893a8961fc660a954", // .300 Blackout AP
				// getCraft("5fd20ff893a8961fc660a954").requirements = [
				// 	{
				// 		areaType: 10,
				// 		requiredLevel: 3,
				// 		type: "Area"
				// 	},
				// 	{
				// 		templateId: "62a0a0bb621468534a797ad5",
				// 		type: "Tool"
				// 	},
				// 	{
				// 		templateId: "5d40425986f7743185265461",
				// 		type: "Tool"
				// 	},
				// 	{
				// 		templateId: "6196365d58ef8c428c287da1",
				// 		count: 120,
				// 		isFunctional: false,
				// 		isEncoded: false,
				// 		type: "Item"
				// 	},
				// 	{
				// 		templateId: "5a6086ea4f39f99cd479502f",
				// 		count: 120,
				// 		isFunctional: false,
				// 		isEncoded: false,
				// 		type: "Item"
				// 	},
				// ]

				// .366 TKM AP-M change
				getCraft("5f0596629e22f464da6bbdd9").requirements = [
					{
						areaType: 10,
						requiredLevel: 2,
						type: "Area",
					},
					{
						templateId: "57a0e5022459774d1673f889",
						count: 100,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "59e4d3d286f774176a36250a",
						count: 100,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "590c2b4386f77425357b6123",
						type: "Tool",
					},
				]
				// 7.62x51mm M61 buff
				getCraft("5a6086ea4f39f99cd479502f").requirements = [
					{
						areaType: 10,
						requiredLevel: 3,
						type: "Area",
					},
					{
						templateId: "5d6fc87386f77449db3db94e",
						count: 2,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5d1c774f86f7746d6620f8db",
						count: 1,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "5a608bf24f39f98ffc77720e",
						count: 80,
						isFunctional: false,
						isEncoded: false,
						type: "Item",
					},
					{
						templateId: "544fb5454bdc2df8738b456a",
						type: "Tool",
					},
				]
				getCraft("5a6086ea4f39f99cd479502f").count = 80

				// 5.45x39mm PP gs nerf
				// getCraft("56dff2ced2720bb4668b4567").count = 200
				// getCraft("56dff2ced2720bb4668b4567").requirements.find((x) => x.templateId == "57347c5b245977448d35f6e1").count = 200
				// getCraft("56dff2ced2720bb4668b4567").requirements.find((x) => x.templateId == "57347c5b245977448d35f6e1").templateId = "56dff4ecd2720b5f5a8b4568"

				// 7.62x39mm PP gzh buff
				// getCraft("64b7af434b75259c590fa893").count = 300
				// getCraft("64b7af434b75259c590fa893").requirements.find((x) => x.templateId == "5656d7c34bdc2d9d198b4587").count = 300

				// "5d0379a886f77420407aa271", // OFZ 30x160mm shell
				getCraft("5d0379a886f77420407aa271").requirements.forEach((x) => {
					if (x.count) {
						x.count = 1
					}
				})

				// "5448be9a4bdc2dfd2f8b456a", // RGD-5 hand grenade
				getCraft("5448be9a4bdc2dfd2f8b456a").requirements.forEach((x) => {
					if (x.count) {
						x.count = 1
					}
				})

				// "Zarya" stun grenade buff
				getCraft("5a0c27731526d80618476ac4").requirements.forEach((x) => {
					if (x.count) {
						x.count = 1
					}
				})

				// */
			} catch (error) {
				logger.warning("\nCraftingRebalance failed. Send bug report. Continue safely.")
				log(error)
			}
		}

		// if (config.OtherTweaks.CollectorQuestEarlyStart.enabled == true) {
		// WIP, waiting for SPT to update
		// 	// Object.values()
		// 	tables.templates.quests["5c51aac186f77432ea65c552"].conditions.AvailableForFinish.push(
		// 		tables.templates.quests["5c51aac186f77432ea65c552"].conditions.AvailableForStart[0]
		// 	)
		// 	tables.templates.quests["5c51aac186f77432ea65c552"].conditions.AvailableForStart = [
		// 		{
		// 			_parent: "Level",
		// 			_props: {
		// 				id: "51d33b2d4fad9e61441772c0",
		// 				index: 1,
		// 				parentId: "",
		// 				dynamicLocale: false,
		// 				value: 1,
		// 				compareMethod: ">=",
		// 				visibilityConditions: [],
		// 			},
		// 			dynamicLocale: false,
		// 		},
		// 	]
		// }

		function getCraft(endProductID) {
			try {
				return tables.hideout.production.find((x) => x.endProduct == endProductID && x.areaType != 21)
			} catch (error) {
				logger.warning("\ngetCraft function failed bacause of the other mod. Ignore this error safely and continue. Send bug report.")
				log(endProductID)
				log(error)
			}
		}

		function getCraftID(craftID) {
			try {
				return tables.hideout.production.find((x) => x._id == craftID && x.areaType != 21)
			} catch (error) {
				logger.warning("\ngetCraft function failed bacause of the other mod. Ignore this error safely and continue. Send bug report.")
				log(craftID)
				log(error)
			}
		}

		function getItemInHandbook(itemID) {
			try {
				return handbook.Items.find((i) => i.Id === itemID) // Outs: @Id, @ParentId, @Price
			} catch (error) {
				logger.warning("\ngetItemInHandbook function failed bacause of the other mod. Ignore this error safely and continue. Send bug report.")
				log(itemID)
				log(error)
			}
		}

		function getItemName(itemID, locale = "en") {
			if (locales[locale][`${itemID} Name`] != undefined) {
				// return items[itemID]._name
				return locales[locale][`${itemID} Name`]
			} else {
				return items[itemID]?._name
			}
		}

		function roundWithPrecision(num, precision) {
			const multiplier = Math.pow(10, precision)
			return Math.round(num * multiplier) / multiplier
		}

		function sort(a, b) {
			if (a > b) {
				return 1
			}
			if (a < b) {
				return -1
			}
			return 0
		}
	}
}

const log = (i: any) => {
	console.log(i)
}

module.exports = { mod: new Mod() }
