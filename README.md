# G.A.M.E.F.T.
Grok's Automated Modpack for Escape From Tarkov (G.A.M.E.F.T.)

The first goal of this project is to provide an easy to install, easy to update, vanilla+ single player / coop Tarkov focused on crafting and balanced progression with no « easy money can buy everything easily ».


# Changes

## Modlist:
- Server:
    "MoreCheckmarksBackend",
    "SWAG",
    "IhanaMies-LootValueBackend",
    "odt-iteminfo-4.0.3",
    "DanW-LateToTheParty",
    "SPT-Realism-Mod-Server",
    "leaves-relooted",
    "WTT-PackNStrap",
    "ServerValueModifier",
    "odt-softcore-2.1.1",
    "leaves-lootfuckery",
    "Skwizzy-NoDiscardLimit",
    "DanW-SPTQuestingBots",
    "zSolarint-SAIN-ServerMod",
    "zzMusicManiac-KeysInLoot"

- Client:
    "AmandsGraphics"
    "CactusPie.FastSearch"
    "CactusPie.RamCleanerInterval"
    "CustomMusic"
    "DanW-SPTQuestingBots"
    "Declutterer"
    "DrakiaXYZ-BigBrain"
    "DrakiaXYZ-BotDebug"
    "DrakiaXYZ-Waypoints"
    "dvize.Donuts"
    "dvize.GTFO"
    "DynamicExternalResolution"
    "kmyuhkyuk-EFTApi"
    "kmyuhkyuk-GamePanelHUD"
    "LootValue"
    "MoreCheckmarks"
    "Realism"
    "SAIN"
    "skwizzy.LootingBots"
    "SPTQuestingBots"
    "ThatsLit"
    "WTT-PackNStrap"

## Custom changes

### Mods changes
- Generally customised most mods default settings to have a better experience, see below for the specified changes related to the various game aspects.
- The idea is to keep a "Tarkov vanilla+" experience, most of the profound game mechanics changes of the different mods have been removed / not enabled to keep the "vanilla tarkov" experience (realism ballistics, armors and health changes, etc).

### Calibers changes 
- Changes based on vanilla ballistics (not Realism ballistics).
- The 9x21 and the 9x39 are viable again (better penetration scaling of the ammo compared to other calibers according to Prapor LL).
- The 9x18 is a decent option to start with at Prapor and there is even a bullet that pierces T3 armors now available early on (general buff of the penetration of the best 9x18 rounds).
- .300 BLK FMJ penetration boosted from 30 to 34 to make the caliber a valid option when reaching skier LL3.
- Buffed the penetration of certain 5.7 bullets, the idea is that 4.6 should not be the only endgame option on the SMG side.
- Buffed 12.7x55 penetration so that the caliber is useable.

### Traders rebalance
- All traders have trades for all the quest related keys in the game.
- Reduced the availability of good 5.45 rounds at Prapor LL1.
- Moved most rifle ammo with penetration above 20 to Prapor LL2 / LL3.
- Faster access to good SMG rounds or subsonic rounds at Prapor (usually LL1 and LL2).
- Added a trade for 5.45 PS at Prapor LL2.
- Added a trade for 5.45 PP at Prapor LL3. The idea is that Peacekeeper and 5.56 should no longer be the only viable option on the AR side midgame.
- Added a trade for 9x19 PBP at Prapor LL4.
- Easier VSS trade at prapor LL1
- Added a 9x39 SPP trade at Prapor LL3.
- The Beta container trade is now much fairer (no need for a tank battery, one less virtex and 1 less military cable)
- Peacekeeper sells the Fortis Shift grip in LL2 (for gunsmith).
- Most of the "special gear you need to wear to do kills with for quests" is available at traders (Ushanka, Scav vest, Bomber, Raybench, etc).
- The "BakeEz" cook book was added for a high price from Therapist (the thing is literally impossible to loot and is necessary for the Library)

### NPCs gear rebalance
- Rework of NPCs armor tiers:
    PMC T1 > T2 armors (rare T3)
    PMC T2 > T3 armors (rare T4)
    PMC T3 > T4 armors
    PMC T4 > T5 armors
    PMC T5 > T6 armors
- Rework of bullets used by PMCs: fewer very strong bullets in general. Low level PMCs also have fewer strong bullets (the bullet pen is generally lower than the armor worn by PMCs)
- Strong PMCs have better bullets, but fewer “ultimate” bullets for each caliber

### Gear rebalance
- TOR-2 helmet is now tier 4 armor and moved to Ragman LL4
- EXFIL is now T5 armor and both tan and black are gated behind a Peacekeeper quest. Black variant is more expensive becaue of the faceshield.

### Economy changes:
- The price of LEDX has been divided by 10.
- The price of Bitcoin has been divided by 1.5.
- Dynamic loot like live
- Increased keys spawn rates

### AI improvements
- Bosses spawn rate set at 15%
- Improved NPCs AI through modified SAIN preset. They don't only shoot your stomach anymore.
- Balanced NPCs spawns through custom Donuts spawn timer and custom hard bot caps per map. The action is tense but you still have some room to breathe especially in the "barren" parts of the maps. The hotspots still pack a ton of action (Interchange main shops alley, etc).
- Reduction in the spawning of high level PMCs in general

### Hideout rebalance
- The air filtering unit only costs 10,000 dollars (instead of 25,000) and gives +40% Combat skill instead of Physical skill.
- Crafting without fuel now takes a humongous amount of time to complete: you need fuel to do stuff.
- The purified water takes 1 hour with the generator on to complete a single super water.
- 1 water filter generates several purified waters (4)
- Bitcoins take a lot longer to make.
- Only 1 bitcoin can be stored at a time.

### Crafting rebalance
- Some crafts are rebalanced to be less of a chore.
- COFDM crafting doesn't require Lightkeeper quests to be done.
- Most crafts are instant.
- Water filter produces more purified water.
- Purified water takes about an hour to generate when the generator is on (10+ hours when off).

### Skills:
- Much faster skills progression in general.
- Faster looting: looting is generally much faster. Containers with few objects are looted very quickly (drawers) but containers with a lot of objects take longer to be looted.

### Gym rework
- Gym is available every 40 minutes or so.
- Gym is based on 6 circles. Usually corresponding to "mid to hard" circle tiers.
- Each success consummes more energy and hydration. Failures as well. 
- Higher chance to break your bones on a fail.
- Gym training also raises health and vitality levels, but less often and more slowly than strength and stamina
- Gym can get maxed Strength and Endurence after about 50h of gameplay.

### Graphics:
- Amands graphics with slight config changes for the fog.

### Performance:
- Improved questing bots and looting bots performances by sacrificing some aspects of the mods (no real changes to the bot behavior in game though).

### Quests:
- All quests timers removed
- Chumming needs to place only 1 gold chain, not 3, and the placement is faster.
- "Network Provider Part 1" access changed, the requirements are now:
    The Punisher Part 5
    Bullshit
    House Arrest - Part 1
    Cargo X Part 4
    Peacekeeping mission
    The Blood of War Part 3
    Broadcast Part 2
    Private clinic
    Drug Trafficking
- The Setup quest went from 15 PMC to 4 PMC > this is mainly because once you reach a certain level, doing 15 PMC with pump action shotguns with guys in T5 and T6 is complicated. This quest being necessary for Network Provider, I told myself that it was better to rebalance it than to remove it completely.
