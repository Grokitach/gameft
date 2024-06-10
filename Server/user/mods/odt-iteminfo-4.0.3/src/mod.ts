import { DependencyContainer } from "tsyringe"

import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes"
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import { IHideoutConfig } from "@spt-aki/models/spt/config/IHideoutConfig"
import { IRagfairConfig } from "@spt-aki/models/spt/config/IRagfairConfig"
import { LogBackgroundColor } from "@spt-aki/models/spt/logging/LogBackgroundColor"
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor"
import { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import { ConfigServer } from "@spt-aki/servers/ConfigServer"
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer"
import { ItemBaseClassService } from "@spt-aki/services/ItemBaseClassService"
import { ITemplateItem } from "@spt-aki/models/eft/common/tables/ITemplateItem"
import { HandbookItem, IHandbookBase } from "@spt-aki/models/eft/common/tables/IHandbookBase"
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables"
import { IHideoutProduction } from "@spt-aki/models/eft/hideout/IHideoutProduction"
import { IHideoutArea } from "@spt-aki/models/eft/hideout/IHideoutArea"
import { IQuest } from "@spt-aki/models/eft/common/tables/IQuest"
import { IArmorMaterials } from "@spt-aki/models/eft/common/IGlobals"
import { IBarterScheme, ITrader } from "@spt-aki/models/eft/common/tables/ITrader"
import { Traders } from "@spt-aki/models/enums/Traders"

import config from "../config/config.json"
import tiers from "../config/tiers.json"
import translations from "./translations.json"
import { Item } from "@spt-aki/models/eft/common/tables/IItem"

// Using `this.` is perfectly fine. Much better than having ambiguous and typeless variables declared in some global scope
// Don't worry - there's always opportunities to learn :) - Terkoiz

const newLine = "\n"

const bsgBlacklist = [
	"6357c98711fb55120211f7e1", // M203 40mm underbarrel grenade launcher
	"62e7e7bbe6da9612f743f1e0", // GP-25 "Kostyor" 40mm underbarrel grenade launcher
	"5648b62b4bdc2d9d488b4585", // GP-34 40mm underbarrel grenade launcher
	"59c1383d86f774290a37e0ca", // 5.56x45 Magpul PMAG D-60 STANAG 60-round magazine
	"544a37c44bdc2d25388b4567", // 5.56x45 SureFire MAG5-60 STANAG 60-round magazine
	"5c6175362e221600133e3b94", // AK 7.62x39 ProMag AK-A-16 73-round drum magazine
	"5cfe8010d7ad1a59283b14c6", // AK 7.62x39 X Products X-47 50-round drum magazine
	"6410733d5dd49d77bd07847e", // Tokarev AVT-40 7.62x54R automatic rifle
	"5d1b5e94d7ad1a2b865a96b0", // FLIR RS-32 2.25-9x 35mm 60Hz thermal riflescope
	"5c0558060db834001b735271", // GPNVG-18 Night Vision goggles
	"5a1eaa87fcdbcb001865f75e", // Trijicon REAP-IR thermal scope
	"6478641c19d732620e045e17", // SIG Sauer ECHO1 1-2x30mm 30Hz thermal reflex scope
	"63fc44e2429a8a166c7f61e6", // Armasight Zeus-Pro 640 2-8x50 30Hz thermal scope
	"6165ac306ef05c2ce828ef74", // FN SCAR-H 7.62x51 assault rifle (FDE)
	"6183afd850224f204c1da514", // FN SCAR-H 7.62x51 assault rifle
	"65268d8ecb944ff1e90ea385", // Degtyarev RPDN 7.62x39 machine gun
	"5dcbd56fdbd3d91b3e5468d5", // Desert Tech MDR 7.62x51 assault rifle
	"628a60ae6b1d481ff772e9c8", // Rifle Dynamics RD-704 7.62x39 assault rifle
	"64637076203536ad5600c990", // Kalashnikov PKM 7.62x54R machine gun
	"6176aca650224f204c1da3fb", // HK G28 7.62x51 marksman rifle
	"62178c4d4ecf221597654e3d", // RSP-30 reactive signal cartridge (Red)
	"64ca3d3954fc657e230529cc", // Kalashnikov PKP 7.62x54R infantry machine gun
	"5e81ebcd8e146c7080625e15", // FN40GL Mk2 40mm grenade launcher
	"620109578d82e67e7911abf2", // ZiD SP-81 26x75 signal pistol
	"6513ef33e06849f06c0957ca", // Degtyarev RPD 7.62x39 machine gun
	"606587252535c57a13424cfd", // CMMG Mk47 Mutant 7.62x39 assault rifle
	"5a367e5dc4a282000e49738f", // Remington R11 RSASS 7.62x51 marksman rifle
	"5fc22d7c187fea44d52eda44", // SWORD International Mk-18 .338 LM marksman rifle
	"5aafa857e5b5b00018480968", // Springfield Armory M1A 7.62x51 rifle
	"5df8ce05b11454561e39243b", // Knight's Armament Company SR-25 7.62x51 marksman rifle
	"6275303a9f372d6ea97f9ec7", // Milkor M32A1 MSGL 40mm grenade launcher
	"5e848cc2988a8701445df1e8", // TOZ KS-23M 23x75mm pump-action shotgun
	"5c091a4e0db834001d5addc8", // Maska-1SCh bulletproof helmet (Olive Drab)
	"5ca20ee186f774799474abc2", // Vulkan-5 LShZ-5 bulletproof helmet (Black)
	"627e14b21713922ded6f2c15", // Accuracy International AXMC .338 LM bolt-action sniper rifle
	"65709d2d21b9f815e208ff95", // Diamond Age NeoSteel High Cut helmet (Black)
	"5a154d5cfcdbcb001a3b00da", // Ops-Core FAST MT Super High Cut helmet (Black)
	"5f60c74e3b85f6263c145586", // Rys-T bulletproof helmet (Black)
	"545cdb794bdc2d3a198b456a", // 6B43 Zabralo-Sh body armor (Digital Flora)
	"65719f0775149d62ce0a670b", // NPP KlASS Tor-2 helmet (Olive Drab)
	"5aa7e276e5b5b000171d0647", // Altyn bulletproof helmet (Olive Drab)
	"5c17a7ed2e2216152142459c", // Crye Precision AirFrame helmet (Tan)
	"5f60b34a41e30a4ab12a6947", // Galvion Caiman Hybrid helmet (Grey)
	"5ac8d6885acfc400180ae7b0", // Ops-Core FAST MT Super High Cut helmet (Urban Tan)
	"5e01ef6886f77445f643baa4", // Team Wendy EXFIL Ballistic Helmet (Coyote Brown)
	"5e00c1ad86f774747333222c", // Team Wendy EXFIL Ballistic Helmet (Black)
	"5c0e874186f7745dc7616606", // Maska-1SCh bulletproof helmet (Killa Edition)
	"62a61bbf8ec41a51b34758d2", // Big Pipe's smoking pipe
	"60a283193cb70855c43a381d", // NFM THOR Integrated Carrier body armor
	"60a7ad2a2198820d95707a2e", // Tagilla's welding mask "UBEY"
	"5ca21c6986f77479963115a7", // FORT Redut-T5 body armor (Smog)
	"60a7ad3a0c5cb24b0134664a", // Tagilla's welding mask "Gorilla"
	"5f60c85b58eff926626a60f7", // Rys-T face shield
	"5ca2113f86f7740b2547e1d2", // Vulkan-5 helmet face shield
	"62963c18dbc8ab5f0d382d0b", // Death Knight mask
	"65719f9ef392ad76c50a2ec8", // NPP KlASS Tor-2 helmet face shield
	"5a16b7e1fcdbcb00165aa6c9", // Ops-Core FAST multi-hit ballistic face shield
	"64afdcb83efdfea28601d041", // ESAPI level IV ballistic plate
	"619bdeb986e01e16f839a99e", // Armband (RFARMY)
	"657b2797c3dbcb01d60c35ea", // Korund-VM ballistic plate (Back)
	"5e00cdd986f7747473332240", // Team Wendy EXFIL Ballistic face shield (Black)
	"656f664200d62bcd2e024077", // Korund-VM ballistic plates (Front)
	"656fafe3498d1b7e3e071da4", // KITECO SC-IV SA ballistic plate
	"619bddffc9546643a67df6f0", // Armband (Train Hard)
	"656fa53d94b480b8a500c0e4", // TallCom Guardian ballistic plate
	"656faf0ca0dce000a2020f77", // GAC 4sss2 ballistic plate
	"656efaf54772930db4031ff5", // Granit 4 ballistic plates (Back)
	"656f611f94b480b8a500c0db", // Granit 4 ballistic plate (Front)
	"656fa76500d62bcd2e024080", // Kiba Arms Steel ballistic plate
	"655746010177119f4a097ff7", // SAPI level III+ ballistic plate
	"619bde3dc9546643a67df6f2", // Armband (Kiba Arms)
	"656fae5f7c2d57afe200c0d7", // GAC 3s15m ballistic plate
	"656fa61e94b480b8a500c0e8", // NESCO 4400-SA-MC ballistic plate
	"657b28d25f444d6dff0c6c77", // Korund-VM-K ballistic plate (Back)
	"619bc61e86e01e16f839a999", // Armband (Alpha)
	"65573fa5655447403702a816", // Granit Br4 ballistic plate
	"5e01f37686f774773c6f6c15", // Team Wendy EXFIL Ballistic face shield (Coyote Brown)
	"5c0919b50db834001b7ce3b9", // Maska-1SCh face shield (Olive Drab)
	"656fa99800d62bcd2e024088", // Cult Termite ballistic plate
	"656fa8d700d62bcd2e024084", // Cult Locust ballistic plate
	"619bddc6c9546643a67df6ee", // Armband (DEADSKUL)
	"64afc71497cf3a403c01ff38", // Granit Br5 ballistic plate
	"656f66b5c6baea13cd07e108", // Korund-VM-K ballistic plates (Front)
	"619bdf9cc9546643a67df6f8", // Armband (UNTAR)
	"654a4a964b446df1ad03f192", // Granit 4RS ballistic plates (Back)
	"656f63c027aed95beb08f62c", // Granit 4RS ballistic plate (Front)
	"5df8a4d786f77412672a1e3b", // 6Sh118 raid backpack (Digital Flora)
	"61b9e1aaef9a1b5d6a79899a", // Santa's bag
	"5c0e774286f77468413cc5b2", // Mystery Ranch Blackjack 50 backpack (MultiCam)
	"639346cc1c8f182ad90c8972", // Tasmanian Tiger Trooper 35 backpack (Khaki)
	"5f5e46b96bdad616ad46d613", // Eberlestock F4 Terminator load bearing backpack (Tiger Stripe)
	"6034d2d697633951dc245ea6", // Eberlestock G2 Gunslinger II backpack (Dry Earth)
	"5c0e805e86f774683f3dd637", // 3V Gear Paratus 3-Day Operator's Tactical backpack (Foliage Grey)
	"59e763f286f7742ee57895da", // Pilgrim tourist backpack
	"5ab8ebf186f7742d8b372e80", // SSO Attack 2 raid backpack (Khaki)
	"5857a8b324597729ab0a0e7d", // Secure container Beta
	"5c0a840b86f7742ffa4f2482", // T H I C C item case
	"59db794186f77448bc595262", // Secure container Epsilon
	"5c093ca986f7740a1867ab12", // Secure container Kappa
	"5732ee6a24597719ae0c0281", // Waist pouch
	"544a11ac4bdc2d470e8b456a", // Secure container Alpha
	"5857a8bc2459772bad15db29", // Secure container Gamma
	"5b6d9ce188a4501afc1b2b25", // T H I C C Weapon case
	"614451b71e5874611e2c7ae5", // Bottle of Tarkovskaya vodka
	"5b7c710788a4506dec015957", // Lucky Scav Junk box
	"5aafbcd986f7745e590fff23", // Medicine case
	"593962ca86f774068014d9af", // Unknown key
	"5937ee6486f77408994ba448", // Machinery key
	"6389c92d52123d5dd17f8876", // Advanced Electronic Materials textbook
	"6389c8fb46b54c634724d847", // Silicon Optoelectronic Integrated Circuits textbook
	"64d4b23dc1b37504b41ac2b6", // Rusted bloody key
	"6398fd8ad3de3849057f5128", // Backup hideout key
	"63a39e1d234195315d4020bd", // Primorsky 46-48 skybridge key
	"5d6e68a8a4b9360b6c0d54e2", // 12/70 AP-20 armor-piercing slug
	"62389ba9a63f32501b1b4451", // 26x75mm flare cartridge (Red)
	"5cadf6eeae921500134b2799", // 12.7x55mm PS12B
	"5e85a9f4add9fe03027d9bf1", // 23x75mm Zvezda flashbang round
	"5f0596629e22f464da6bbdd9", // .366 TKM AP-M
	"5ba26835d4351e0035628ff5", // 4.6x30mm AP SX
	"62389aaba63f32501b1b444f", // 26x75mm flare cartridge (Green)
	"64d0b40fbe2eed70e254e2d4", // Sacred Amulet
	"62e910aaf957f2915e0a5e36", // Digital secure DSP radio transmitter
	"5d6e68d1a4b93622fe60e845", // 12/70 SuperFormance HP slug
	"5ede47405b097655935d7d16", // 40x46mm M441 (HE) grenade
	"5f0c892565703e5c461894e9", // 40x46mm M433 (HEDP) grenade
	"63a0b2eabea67a6d93009e52", // Radio repeater
	"5d6e68b3a4b9361bca7e50b5", // 12/70 Copper Sabot Premier HP slug
	"5efb0cabfb3e451d70735af5", // .45 ACP AP
	"5ede474b0c226a66f5402622", // 40x46mm M381 (HE) grenade
	"5ba26844d4351e00334c9475", // 4.6x30mm Subsonic SX
	"5c0d5e4486f77478390952fe", // 5.45x39mm PPBS gs "Igolnik"
	"56dff061d2720bb5668b4567", // 5.45x39mm BT gs
	"56dff026d2720bb8668b4567", // 5.45x39mm BS gs
	"56dfef82d2720bbd668b4567", // 5.45x39mm BP gs
	"61962b617c6c7b169525f168", // 5.45x39mm 7N40
	"601949593ae8f707c4608daa", // 5.56x45mm SSA AP
	"635267f063651329f75a4ee8", // 26x75mm distress signal flare (Poison Green)
	"5a608bf24f39f98ffc77720e", // 7.62x51mm M62 Tracer
	"59e690b686f7746c9f75e848", // 5.56x45mm M995
	"54527ac44bdc2d36668b4567", // 5.56x45mm M855A1
	"5cc80f67e4a949035e43bbba", // 5.7x28mm SB193
	"58dd3ad986f77403051cba8f", // 7.62x51mm M80
	"5fc382a9d724d907e2077dab", // .338 Lapua Magnum AP
	"5a26ac0ec4a28200741e1e18", // 9x21mm BT gzh
	"5efb0c1bd79ff02a1f5e68d9", // 7.62x51mm M993
	"5c0d688c86f77413ae3407b2", // 9x39mm BP gs
	"5c0d668f86f7747ccb7f13b2", // 9x39mm SPP gs
	"5e023d48186a883be655e551", // 7.62x54mm R BS gs
	"5efb0da7a29a85116f6ea05f", // 9x19mm PBP gzh
	"6576f4708ca9c4381d16cd9d", // 9x21mm 7N42 "Zubilo"
	"5e023d34e8a400319a28ed44", // 7.62x54mm R BT gzh
	"61962d879bb3d20b0946d385", // 9x39mm PAB-9 gs
	"59e6906286f7746c9f75e847", // 5.56x45mm M856A1
	"5cc80f38e4a949001152b560", // 5.7x28mm SS190
	"5c925fa22e221601da359b7b", // 9x19mm AP 6.3
	"5fc275cf85fd526b824a571a", // .338 Lapua Magnum FMJ
	"57a0e5022459774d1673f889", // 9x39mm SP-6 gs
	"560d61e84bdc2da74d8b4571", // 7.62x54mm R SNB gzh
	"57372c21245977670937c6c2", // 5.45x39mm BT gs ammo pack (120 pcs)
	"601aa3d2b2bcb34913271e6d", // 7.62x39mm MAI AP
	"5fd20ff893a8961fc660a954", // .300 Blackout AP
	"5fc382b6d6fa9c00c571bbc3", // .338 Lapua Magnum TAC-X
	"6489854673c462723909a14e", // 9x39mm BP ammo pack (20 pcs)
	"648984e3f09d032aa9399d53", // 7.62x51mm M993 ammo pack (20 pcs)
	"6489851fc827d4637f01791b", // 7.62x39mm MAI AP ammo pack (20 pcs)
	"6570241bcfc010a0f50069f5", // 12.7x55mm PS12 ammo pack (10 pcs)
	"6570260c1419851aef03e727", // 9x18mm PM P gzh ammo pack (50 pcs)
	"6489879db5a2df1c815a04ef", // .45 ACP AP ammo pack (50 pcs)
	"65702469c5d7d4cb4d07855b", // 12/70 makeshift .50 BMG slug ammo pack (25 pcs)
	"57372c89245977685d4159b1", // 5.45x39mm BT gs ammo pack (30 pcs)
	"57372b832459776701014e41", // 5.45x39mm BS gs ammo pack (120 pcs)
	"65702426cfc010a0f50069f8", // 12/70 5.25mm buckshot ammo pack (25 pcs)
	"65702420bfc87b3a34093219", // 12.7x55mm PS12A ammo pack (10 pcs)
	"657023eccfc010a0f50069ef", // .357 Magnum SP ammo pack (25 pcs)
	"648983d6b5a2df1c815a04ec", // 12.7x55mm PS12B (10 pcs)
	"57372bad245977670b7cd242", // 5.45x39mm BS gs ammo pack (120 pcs)
	"6489870774a806211e4fb685", // 4.6x30mm AP SX ammo pack (40 pcs)
	"657024361419851aef03e6fa", // 12/70 7mm buckshot ammo pack (25 pcs)
	"657024431419851aef03e6fd", // 12/70 Piranha ammo pack (25 pcs)
	"6570243bbfc87b3a3409321f", // 12/70 8.5mm Magnum buckshot ammo pack (25 pcs)
	"64898602f09d032aa9399d56", // 5.45x39mm 7N40 ammo pack (30 pcs)
	"65702414c5d7d4cb4d078555", // .45 ACP RIP ammo pack (50 pcs)
	"657024581419851aef03e700", // 12/70 "Poleva-6u" slug ammo pack (25 pcs)
	"65702479c5d7d4cb4d07855e", // 12/70 Copper Sabot Premier HP slug ammo pack (25 pcs)
	"6529243824cbe3c74a05e5c1", // 6.8x51mm SIG Hybrid
	"5a6086ea4f39f99cd479502f", // 7.62x51mm M61
	"657023f1bfc87b3a34093210", // .366 TKM FMJ ammo pack (20 pcs)
	"6570246fcfc010a0f5006a01", // 12/70 lead slug ammo pack (25 pcs)
	"65702406bfc87b3a34093216", // .45 ACP Hydra-Shok ammo pack (50 pcs)
	"657023d6cfc010a0f50069e9", // .338 Lapua Magnum TAC-X ammo pack (20 pcs)
	"64898583d5b4df6140000a1d", // 5.56x45mm SSA AP ammo pack (50 pcs)
	"6570243fcfc010a0f50069fb", // 12/70 Dual Sabot slug ammo pack (25 pcs)
	"6570247ebfc87b3a34093229", // 12/70 SuperFormance HP slug ammo pack (25 pcs)
	"657023fcbfc87b3a34093213", // .366 TKM Geksa ammo pack (20 pcs)
	"5c1262a286f7743f8a69aab2", // 5.45x39mm PPBS gs "Igolnik" ammo pack (30 pcs)
	"64acea16c4eda9354b0226b0", // 7.62x39mm BP gzh ammo pack (20 pcs)
	"648984b8d5b4df6140000a1a", // 7.62x54mm R BS ammo pack (20 pcs)
	"65702474bfc87b3a34093226", // 12/70 flechette ammo pack (25 pcs)
	"657025bbcfc010a0f5006a35", // 9x21mm P gzh ammo pack (30 pcs)
	"648987d673c462723909a151", // 9x19mm PBP ammo pack (50 pcs)
	"657023e31419851aef03e6ee", // .357 Magnum HP ammo pack (25 pcs)
	"57372c56245977685e584582", // 5.45x39mm BT gs ammo pack (120 pcs)
	"65702452cfc010a0f50069fe", // 12/70 "Poleva-3" slug ammo pack (25 pcs)
	"648985c074a806211e4fb682", // .300 Blackout AP ammo pack (50 pcs)
	"65702432bfc87b3a3409321c", // 12/70 6.5mm Express buckshot ammo pack (25 pcs)
	"59e0d99486f7744a32234762", // 7.62x39mm BP gzh
	"64898838d5b4df6140000a20", // 12/70 AP-20 ammo pack (25 pcs)
	"6489848173c462723909a14b", // .338 Lapua Magnum AP ammo pack (20 pcs)
	"5c1260dc86f7746b106e8748", // 9x39mm BP gs ammo pack (8 pcs)
	"57372bd3245977670b7cd243", // 5.45x39mm BS gs ammo pack (30 pcs)
	"6570240ecfc010a0f50069f2", // .45 ACP Match FMJ ammo pack (50 pcs)
	"657024011419851aef03e6f4", // .366 TKM EKO ammo pack (20 pcs)
	"648986bbc827d4637f01791e", // 5.7x28mm SS190 ammo pack (50 pcs)
	"6570240a1419851aef03e6f7", // .45 ACP Lasermatch FMJ ammo pack (50 pcs)
	"657024831419851aef03e703", // 20/70 5.6mm buckshot ammo pack (25 pcs)
	"6489875745f9ca4ba51c4808", // 9x21mm BT ammo pack (30 pcs)
	"6570244ec5d7d4cb4d078558", // 12/70 Grizzly 40 slug ammo pack (25 pcs)
	"6570249f1419851aef03e709", // 20/70 Star slug ammo pack (25 pcs)
	"657024f9bfc87b3a3409323b", // 5.56x45mm MK 318 Mod 0 (SOST) ammo pack (50 pcs)
	"6570266bc5d7d4cb4d078594", // 5.56x45mm MK 318 Mod 0 (SOST) ammo pack (100 pcs)
	"65702652cfc010a0f5006a53", // 5.56x45mm M855A1 ammo pack (100 pcs)
	"65702524cfc010a0f5006a16", // 5.7x28mm SB193 ammo pack (50 pcs)
	"657023decfc010a0f50069ec", // .357 Magnum FMJ ammo pack (25 pcs)
	"6570264acfc010a0f5006a50", // 5.56x45mm HP ammo pack (100 pcs)
	"657023f81419851aef03e6f1", // .366 TKM AP-M ammo pack (20 pcs)
	"65702664cfc010a0f5006a59", // 5.56x45mm MK 255 Mod 0 (RRLP) ammo pack (100 pcs)
	"6570251ccfc010a0f5006a13", // 5.7x28mm R37.F ammo pack (50 pcs)
	"657023c61419851aef03e6eb", // .300 Whisper ammo pack (50 pcs)
	"657024b31419851aef03e70f", // 23x75mm Shrapnel-25 buckshot ammo pack (5 pcs)
	"657025281419851aef03e71b", // 5.7x28mm SS197SR ammo pack (50 pcs)
	"6570254abfc87b3a34093244", // 7.62x25mm TT PT gzh ammo pack (25 pcs)
	"657025a81419851aef03e724", // 9x19mm Pst gzh ammo pack (50 pcs)
	"657025dfcfc010a0f5006a3b", // 9x39mm SPP gs ammo pack (20 pcs)
	"657026251419851aef03e72a", // 9x18mm PM PSV ammo pack (50 pcs)
	"65702621cfc010a0f5006a44", // 9x18mm PM PS gs PPO ammo pack (50 pcs)
	"657024aebfc87b3a3409322f", // 23x75mm Shrapnel-10 buckshot ammo pack (5 pcs)
	"6570259fcfc010a0f5006a32", // 9x19mm QuakeMaker ammo pack (50 pcs)
	"657024bdc5d7d4cb4d078564", // 23x75mm Zvezda flashbang round ammo pack (5 pcs)
	"657024b8bfc87b3a34093232", // 23x75mm Barrikada slug ammo pack (5 pcs)
	"6570900858b315e8b70a8a98", // 5.45x39mm 7N40 ammo pack (120 pcs)
	"657023dabfc87b3a3409320d", // .338 Lapua Magnum UCW ammo pack (20 pcs)
	"657023ccbfc87b3a3409320a", // .338 Lapua Magnum FMJ ammo pack (20 pcs)
	"657024e8cfc010a0f5006a0d", // 5.56x45mm M856 ammo pack (50 pcs)
	"6570264d1419851aef03e736", // 5.56x45mm M855 ammo pack (100 pcs)
	"657023bebfc87b3a34093207", // .300 Blackout BCP FMJ ammo pack (50 pcs)
	"657025c4c5d7d4cb4d078582", // 9x21mm PS gzh ammo pack (30 pcs)
	"657025ebc5d7d4cb4d078588", // 5.45x39mm PPBS gs "Igolnik" ammo pack (120 pcs)
	"65702536c5d7d4cb4d078570", // 7.62x25mm ТТ LRN ammo pack (25 pcs)
	"65702558cfc010a0f5006a25", // 7.62x51mm M80 ammo pack (20 pcs)
	"657025cfbfc87b3a34093253", // 9x39mm PAB-9 gs ammo pack (20 pcs)
	"6579847c5a0e5879d12f2873", // 9x21mm 7N42 ammo pack (30 pcs)
	"6579846c1ec1943afb14c15a", // 9x21mm 7U4 ammo pack (30 pcs)
	"657025d4c5d7d4cb4d078585", // 9x39mm SP-5 gs ammo pack (20 pcs)
	"657024d2bfc87b3a34093235", // 4.6x30mm Subsonic SX ammo pack (40 pcs)
	"657025961419851aef03e721", // 9x19mm Green Tracer ammo pack (50 pcs)
	"6570265bcfc010a0f5006a56", // 5.56x45mm M856A1 ammo pack (100 pcs)
	"6570252dbfc87b3a34093241", // 5.7x28mm SS198LF ammo pack (50 pcs)
	"657025a4bfc87b3a34093250", // 9x19mm PSO gzh ammo pack (50 pcs)
	"657024a4bfc87b3a3409322c", // 20/70 "Poleva-3" slug ammo pack (25 pcs)
	"657024a91419851aef03e70c", // 20/70 "Poleva-6u" slug ammo pack (25 pcs)
	"65702619bfc87b3a34093259", // 9x18mm PM PPe gzh ammo pack (50 pcs)
	"657025dabfc87b3a34093256", // 9x39mm SP-6 gs ammo pack (20 pcs)
	"65702566bfc87b3a3409324d", // 7.62x51mm TCW SP ammo pack (20 pcs)
	"657024d8c5d7d4cb4d078567", // 5.56x45mm FMJ ammo pack (50 pcs)
	"65702639bfc87b3a3409325c", // 9x18mm PM SP8 gzh ammo pack (50 pcs)
	"6570249bcfc010a0f5006a07", // 20/70 Devastator slug ammo pack (25 pcs)
	"6570262d1419851aef03e72d", // 9x18mm PM Pst gzh ammo pack (50 pcs)
	"657024c81419851aef03e712", // 4.6x30mm Action SX ammo pack (40 pcs)
	"65702449bfc87b3a34093223", // 12/70 FTX Custom Lite slug ammo pack (25 pcs)
	"65702554bfc87b3a34093247", // 7.62x51mm M62 Tracer ammo pack (20 pcs)
	"6570255dbfc87b3a3409324a", // 7.62x51mm Ultra Nosler ammo pack (20 pcs)
	"65702520bfc87b3a3409323e", // 5.7x28mm R37.X ammo pack (50 pcs)
	"65702572c5d7d4cb4d078576", // 7.62x54mm R BT gzh ammo pack (20 pcs)
	"6570259bc5d7d4cb4d07857f", // 9x19mm Luger CCI ammo pack (50 pcs)
	"65702495c5d7d4cb4d078561", // 20/70 7.5mm buckshot ammo pack (25 pcs)
	"657024cecfc010a0f5006a0a", // 4.6x30mm FMJ SX ammo pack (40 pcs)
	"657025421419851aef03e71e", // 7.62x25mm TT P gl ammo pack (25 pcs)
	"6570257cc5d7d4cb4d078579", // 7.62x54mm R PS gzh ammo pack (20 pcs)
	"65702591c5d7d4cb4d07857c", // 9x19mm AP 6.3 ammo pack (50 pcs)
	"618a431df1eb8e24b8741deb", // RGO hand grenade
	"6570253ec5d7d4cb4d078573", // 7.62x25mm TT AKBS ammo pack (25 pcs)
	"65702584cfc010a0f5006a2f", // 7.62x54mm R T-46M gzh ammo pack (20 pcs)
	"65702630cfc010a0f5006a4a", // 9x18mm PM RG028 gzh ammo pack (50 pcs)
	"657025c9cfc010a0f5006a38", // 9x21mm PE gzh ammo pack (30 pcs)
	"6570254fcfc010a0f5006a22", // 7.62x51mm M61 ammo pack (20 pcs)
	"657024f5cfc010a0f5006a10", // 5.56x45mm MK 255 Mod 0 (RRLP) ammo pack (50 pcs)
	"65702532cfc010a0f5006a19", // 7.62x25mm ТТ FMJ43 ammo pack (25 pcs)
	"6570253acfc010a0f5006a1c", // 7.62x25mm ТТ LRNPC ammo pack (25 pcs)
	"657026451419851aef03e733", // 5.56x45mm FMJ ammo pack (100 pcs)
	"65702546cfc010a0f5006a1f", // 7.62x25mm TT Pst gzh ammo pack (25 pcs)
	"657024921419851aef03e706", // 20/70 7.3mm buckshot ammo pack (25 pcs)
	"65702610cfc010a0f5006a41", // 9x18mm PM PBM gzh ammo pack (50 pcs)
	"657023a9126cc4a57d0e17a6", // .300 Blackout CBJ ammo pack (50 pcs)
	"6570248dcfc010a0f5006a04", // 20/70 6.2mm buckshot ammo pack (25 pcs)
	"65702681bfc87b3a3409325f", // 5.56x45mm SSA AP ammo pack (100 pcs)
	"657023e7c5d7d4cb4d078552", // .357 Magnum JHP ammo pack (25 pcs)
	"65702561cfc010a0f5006a28", // 7.62x51mm BCP FMJ ammo pack (20 pcs)
	"65702577cfc010a0f5006a2c", // 7.62x54mm R LPS gzh ammo pack (20 pcs)
	"65702656c5d7d4cb4d078591", // 5.56x45mm M856 ammo pack (100 pcs)
	"657024debfc87b3a34093238", // 5.56x45mm HP ammo pack (50 pcs)
	"6570265f1419851aef03e739", // 5.56x45mm M995 ammo pack (100 pcs)
	"657025161419851aef03e718", // 5.7x28mm L191 ammo pack (50 pcs)
	"6570261dc5d7d4cb4d07858e", // 9x18mm PM PRS gs ammo pack (50 pcs)
	"657024e3c5d7d4cb4d07856a", // 5.56x45mm M855A1 ammo pack (50 pcs)
	"65702606cfc010a0f5006a3e", // 9x18mm PM BZhT gzh ammo pack (50 pcs)
	"65702614c5d7d4cb4d07858b", // 9x18mm PM PPT gzh ammo pack (50 pcs)
	"65702640cfc010a0f5006a4d", // 9x18mm PMM PstM gzh ammo pack (50 pcs)
	"657024ecc5d7d4cb4d07856d", // 5.56x45mm M856A1 ammo pack (50 pcs)
	"617fd91e5539a84ec44ce155", // RGN hand grenade
	"657023b1cfc010a0f50069e5", // .300 Blackout M62 Tracer ammo pack (50 pcs)
	"657024f01419851aef03e715", // 5.56x45mm M995 ammo pack (50 pcs)
	"657984a50fbff513dd435765", // 9x39mm FMJ ammo pack (20 pcs)
	"657026341419851aef03e730", // 9x18mm PM SP7 gzh ammo pack (50 pcs)
	"657023b71419851aef03e6e8", // .300 Blackout V-Max ammo pack (50 pcs)
	"65702629cfc010a0f5006a47", // 9x18mm PM PSO gzh ammo pack (50 pcs)
	"6389c7f115805221fb410466", // Far-forward GPS Signal Amplifier Unit
	"6389c85357baa773a825b356", // Advanced current converter
	"5df8a77486f77412672a1e3f", // Christmas tree ornament (Violet)
	"59f32c3b86f77472a31742f0", // Dogtag USEC
	"59faff1d86f7746c51718c9c", // Physical Bitcoin
	"6389c7750ef44505c87f5996", // Microcontroller board
	"5df8a72c86f77412640e2e83", // Christmas tree ornament (Silver)
	"5df8a6a186f77412640e2e80", // Christmas tree ornament (Red)
	"59f32bb586f774757e1e8442", // Dogtag BEAR
]

class ItemInfo implements IPostDBLoadMod {
	database: DatabaseServer
	configServer: ConfigServer
	itemBaseClassService: ItemBaseClassService
	ragfairConfig: IRagfairConfig
	hideoutConfig: IHideoutConfig
	logger: ILogger
	tables: IDatabaseTables
	items: Record<string, ITemplateItem>
	handbook: IHandbookBase
	locales: Record<string, Record<string, string>>
	fleaPrices: Record<string, number>
	hideoutProduction: IHideoutProduction[]
	hideoutAreas: IHideoutArea[]
	quests: Record<string, IQuest>
	armors: IArmorMaterials
	traders: Record<string, ITrader>
	traderList: ITrader[]
	euroRatio: number
	dollarRatio: number

	private init(container: DependencyContainer) {
		this.database = container.resolve<DatabaseServer>("DatabaseServer")
		this.configServer = container.resolve<ConfigServer>("ConfigServer")
		this.itemBaseClassService = container.resolve<ItemBaseClassService>("ItemBaseClassService")
		this.ragfairConfig = this.configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR)
		this.hideoutConfig = this.configServer.getConfig<IHideoutConfig>(ConfigTypes.HIDEOUT)

		this.logger.info("[Item Info] Database data is loaded, working...")

		this.tables = this.database.getTables()
		this.items = this.tables.templates.items
		this.handbook = this.tables.templates.handbook
		this.locales = this.tables.locales.global
		this.fleaPrices = this.tables.templates.prices
		this.hideoutProduction = this.tables.hideout.production
		this.hideoutAreas = this.tables.hideout.areas
		this.quests = this.tables.templates.quests
		this.armors = this.tables.globals.config.ArmorMaterials
		this.traders = this.tables.traders

		// Hardcode list for best buy_price_coef
		this.traderList = [
			this.traders[Traders.THERAPIST],
			this.traders[Traders.RAGMAN],
			this.traders[Traders.JAEGER],
			this.traders[Traders.MECHANIC],
			this.traders[Traders.PRAPOR],
			this.traders[Traders.SKIER],
			this.traders[Traders.PEACEKEEPER]
		]
	}

	public postDBLoad(container: DependencyContainer) {
		this.logger = container.resolve<ILogger>("WinstonLogger")

		// TODO: With order.json being a thing, this can probably be removed and instead instructions for changing load order could be added
		if (config.delay.enabled) {
			this.logger.log(
				`[Item Info] Mod compatibility delay enabled (${config.delay.seconds} seconds), waiting for other mods data to load...`,
				LogTextColor.BLACK,
				LogBackgroundColor.CYAN
			)
			setTimeout(() => {
				this.init(container)
				this.ItemInfoMain()
			}, config.delay.seconds * 1000)
		} else {
			this.init(container)
			this.ItemInfoMain()
		}
	}

	private ItemInfoMain(): void {
		let userLocale = config.UserLocale

		if (!config.HideLanguageAlert) {
			this.logger.log(
				"[Item Info] This mod supports other languages! \nМод поддерживает другие языки! \nEste mod es compatible con otros idiomas! \nTen mod obsługuje inne języki! \nEnglish, Russian, Spanish, Korean, French, Chinese, Japanese and German are fully translated.\nHide this message in config.json",
				LogTextColor.BLACK,
				LogBackgroundColor.WHITE
			)
			this.logger.log(
				`[Item Info] Your selected language is "${userLocale}". \nYou can now customise it in Item Info config.json file. \nLooking for translators, PM me! \nTranslation debug mode is availiable in translations.json`,
				LogTextColor.BLACK,
				LogBackgroundColor.GREEN
			)
		}

		if (translations.debug.enabled) {
			this.logger.warning(`Translation debugging mode enabled! Changing userLocale to ${translations.debug.languageToDebug}`)
			userLocale = translations.debug.languageToDebug
		}

		// Fill the missing translation dictionaries with English keys as a fallback + debug mode to help translations. Smart.
		for (const key in translations["en"]) {
			for (const lang in translations) {
				if (
					translations.debug.enabled &&
					lang != "en" &&
					lang == translations.debug.languageToDebug &&
					translations[translations.debug.languageToDebug][key] == translations["en"][key] &&
					key != ""
				) {
					this.logger.warning(
						translations.debug.languageToDebug + ` language "${translations[translations.debug.languageToDebug][key]}" is the same as in English`
					)
				}

				if (key in translations[lang] == false) {
					if (translations.debug.enabled && translations.debug.languageToDebug == lang) {
						this.logger.warning(`${lang} language is missing "${key}" transaition!`)
					}

					translations[lang][key] = translations["en"][key]
				}
			}
		}

		// Description generator for .md
		//const descriptionGen = false
		//if (descriptionGen) {
		//	for (const conf in config) {
		//		log("## " + conf)
		//		log("" + config[conf]._description)
		//		log("> " + config[conf]._example)
		//		log(newLine)
		//	}
		//}

		//for (const userLocale in locales){
		// Put main item loop here to make the mod universally international.
		// Insane loading times each time provided for free.
		// In theory, the whole thing can be *slightly* optimised locally, per function with dictionaries, with language arrays for each generated string, etc, but it's a MAJOR refactoring of the whole codebase, and it's not worth the hassle and my sanity.
		// Let the user select their preferred locale in config once, this will save A LOT of time for everybody, that's good enough solution.
		// I'll just pretend I thought about it beforehand and will call it "in hindsight optimization". Cheers.
		// P.S. Is there a way to access last user selected locale at IPreAkiLoadMod?
		//}

		this.euroRatio = this.handbook.Items.find((x) => x.Id == "569668774bdc2da2298b4568").Price
		this.dollarRatio = this.handbook.Items.find((x) => x.Id == "5696686a4bdc2da3298b456a").Price

		for (const itemID in this.items) {
			const item = this.items[itemID]
			const itemInHandbook = this.getItemInHandbook(itemID)

			if (
				item._type === "Item" && // Check if the item is a real item and not a "node" type.
				itemInHandbook != undefined && // Ignore "useless" items
				!item._props.QuestItem && // Ignore quest items.
				item._parent != "543be5dd4bdc2deb348b4569" // Ignore currencies.
			) {
				// let name = this.getItemName(itemID, userLocale) // for debug only
				// item._props.ExaminedByDefault = true // DEBUG!!!

				// BSG Blacklist generator
				// if (item._props.CanSellOnRagfair == false){
				// 	// log(itemID)
				// 	// log(this.getItemName(itemID, userLocale))
				// 	log(`"${itemID}", // ${this.getItemName(itemID, "en")}`)
				// }

				const i18n = translations[userLocale]
				// boilerplate defaults
				let descriptionString = ""
				let priceString = ""
				let barterString = ""
				let productionString = ""
				let usedForBarterString = ""
				let usedForQuestsString = ""
				let usedForHideoutString = ""
				let usedForCraftingString = ""
				let armorDurabilityString = ""
				let spawnChanceString = ""
				let slotefficiencyString = ""
				let headsetDescription = ""
				let tier = ""
				let itemRarity = 0
				let spawnString = ""

				let fleaPrice = this.getFleaPrice(itemID)
				const itemBestVendor = this.getItemBestTrader(itemID, userLocale)
				let traderPrice = Math.round(itemBestVendor.price)
				const traderName = itemBestVendor.name

				let spawnChance = 10 // DEGUG

				const slotDensity = this.getItemSlotDensity(itemID)

				const itemBarters = this.bartersResolver(itemID)
				const barterInfo = this.barterInfoGenerator(itemBarters, userLocale)
				const barterResourceInfo = this.barterResourceInfoGenerator(itemID, userLocale)
				const rarityArray = []
				rarityArray.push(barterInfo.rarity) // futureprofing, add other rarity calculations
				itemRarity = Math.min(...rarityArray)

				let isBanned = false
				if (config.useBSGStaticFleaBanlist) {
					isBanned = bsgBlacklist.includes(itemID)
				} else {
					isBanned = !item._props.CanSellOnRagfair
				}

				if (isBanned) {
					fleaPrice = i18n.BANNED

					if (!itemRarity) {
						itemRarity = 7
					}
				}

				if (item._parent == "543be5cb4bdc2deb348b4568") {
					// Ammo boxes special case
					const count = item._props.StackSlots[0]._max_count
					const ammo = item._props.StackSlots[0]._props.filters[0].Filter[0]

					const value = this.getItemBestTrader(ammo).price
					// let value = this.getItemInHandbook(ammo).price
					traderPrice = value * count

					if (!itemRarity) {
						itemRarity = this.barterInfoGenerator(this.bartersResolver(ammo)).rarity
					}
				}

				if (config.BulletStatsInName.enabled) {
					if (item._props.ammoType === "bullet" || item._props.ammoType === "buckshot") {
						let damageMult = 1
						if (item._props.ammoType === "buckshot") {
							damageMult = item._props.buckshotBullets
						}
						this.addToName(itemID, ` (${item._props.Damage * damageMult}/${item._props.PenetrationPower})`, "append")
					}
				}

				// if (config.FleaAbusePatch.enabled) {
				// 	if (fleaPrice * this.ragfairConfig.dynamic.price.min < traderPrice && !isBanned) {
				// 		// Ignore banned items for compatibility with Softcore mod.
				// 		// log(name)
				// 		const fleaPriceFix = Math.round(traderPrice * (1 / this.ragfairConfig.dynamic.price.min + 0.01))
				// 		this.fleaPrices[itemID] = fleaPriceFix
				// 		fleaPrice = fleaPriceFix
				// 	}
				// }

				if (config.RarityRecolor.enabled && !config.RarityRecolorBlacklist.includes(item._parent)) {
					// item._props.BackgroundColor = "grey"

					for (const customItem in config.RarityRecolor.customRarity) {
						if (customItem == itemID) {
							itemRarity = config.RarityRecolor.customRarity[customItem]
						}
					}

					if (itemRarity == 7) {
						tier = i18n.OVERPOWERED
						item._props.BackgroundColor = tiers.OVERPOWERED
					} else if (itemRarity == 1) {
						tier = i18n.COMMON
						item._props.BackgroundColor = tiers.COMMON
					} else if (itemRarity == 2) {
						tier = i18n.RARE
						item._props.BackgroundColor = tiers.RARE
					} else if (itemRarity == 3) {
						tier = i18n.EPIC
						item._props.BackgroundColor = tiers.EPIC
					} else if (itemRarity == 4) {
						tier = i18n.LEGENDARY
						item._props.BackgroundColor = tiers.LEGENDARY
					} else if (itemRarity == 5) {
						tier = i18n.UBER
						item._props.BackgroundColor = tiers.UBER
					} else if (spawnChance < 2 || itemRarity == 6) {
						// can get 6 from custom rules only
						tier = i18n.UNOBTAINIUM
						item._props.BackgroundColor = tiers.UNOBTAINIUM
					} else if (itemRarity == 8) {
						// 8 is for custom dim red background
						tier = i18n.CUSTOM
						item._props.BackgroundColor = tiers.CUSTOM
					} else if (itemRarity == 9) {
						// 8 is for custom dim orange background
						// tier = i18n.CUSTOM2
						item._props.BackgroundColor = tiers.CUSTOM2
					}

					if (config.RarityRecolor.fallbackValueBasedRecolor && itemRarity == 0) {
						let itemValue = itemInHandbook.Price

						if (item._props.StackMaxSize > 1) {
							// log(`"${itemID}", // ${name}`)
							itemValue = itemInHandbook.Price * item._props.StackMaxSize
						}

						const itemSlots = item._props.Width * item._props.Height
						if (itemSlots > 1) {
							itemValue = Math.round(itemValue / itemSlots)
						}
						// log(`"${itemID}", // ${name}, ${item._props.BackgroundColor}, ${itemValue}`)

						if (item._parent == "543be5cb4bdc2deb348b4568") {
							// Ammo boxes special case
							const count = item._props.StackSlots[0]._max_count
							const ammo = item._props.StackSlots[0]._props.filters[0].Filter[0]
							const value = this.getItemInHandbook(ammo).Price
							itemValue = value * count
						}

						// TODO: This will generate non-user friendly errors if they f*ck up their config. Maybe needs manual validation to ensure that all tiers.X values are numbers?
						if (itemValue < Number.parseInt(tiers.COMMON_VALUE_FALLBACK)) {
							// tier = i18n.COMMON
							item._props.BackgroundColor = tiers.COMMON
						} else if (itemValue < Number.parseInt(tiers.RARE_VALUE_FALLBACK)) {
							// tier = i18n.RARE
							item._props.BackgroundColor = tiers.RARE
						} else if (itemValue < Number.parseInt(tiers.EPIC_VALUE_FALLBACK)) {
							// tier = i18n.EPIC
							item._props.BackgroundColor = tiers.EPIC
						} else if (itemValue < Number.parseInt(tiers.LEGENDARY_VALUE_FALLBACK)) {
							// tier = i18n.LEGENDARY
							item._props.BackgroundColor = tiers.LEGENDARY
						} else if (itemValue < Number.parseInt(tiers.UBER_VALUE_FALLBACK)) {
							// tier = i18n.UBER
							item._props.BackgroundColor = tiers.UBER
						} else {
							// log(`"${itemID}", // ${name}, ${item._props.BackgroundColor}, ${itemValue}`)
							// tier = i18n.UNOBTAINIUM
							item._props.BackgroundColor = tiers.UNOBTAINIUM
						}
					}
					if (config.RarityRecolor.addTierNameToPricesInfo) {
						if (tier.length > 0) {
							priceString += tier + " | "
						}
					}
				}

				if (config.ArmorInfo.enabled) {
					if (item._props.armorClass > 0) {
						const armor = this.armors[item._props.ArmorMaterial]
						// prettier-ignore
						armorDurabilityString += `${config.ArmorInfo.addArmorClassInfo ? i18n.Armorclass + ": " + item._props?.armorClass + " | " : ""}${i18n.Effectivedurability}: ${Math.round(item._props?.MaxDurability / armor?.Destructibility)} (${i18n.Max}: ${Math.round(item._props?.MaxDurability)} x ${this.locales[userLocale][`Mat${(item._props?.ArmorMaterial)}`]}: ${roundWithPrecision(1 / armor?.Destructibility, 1)}) | ${i18n.Repairdegradation}: ${Math.round(armor?.MinRepairDegradation * 100)}% - ${Math.round(armor?.MaxRepairDegradation * 100)}%` + newLine + newLine;
						//log(name)
						//log(armorDurabilityString)
					}
				}

				if (config.ContainerInfo.enabled) {
					if (item._props.Grids?.length > 0) {
						let totalSlots = 0
						for (const grid of item._props.Grids) {
							totalSlots += grid._props.cellsH * grid._props.cellsV
						}
						const slotefficiency = roundWithPrecision(totalSlots / (item._props.Width * item._props.Height), 2)
						// prettier-ignore
						slotefficiencyString += `${i18n.Slotefficiency}: ×${slotefficiency} (${totalSlots}/${item._props.Width * item._props.Height})` + newLine + newLine;
						// log(name)
						// log(slotefficiencyString)
					}
				}

				if (config.MarkValueableItems.enabled) {
					const itemvalue = traderPrice / slotDensity
					let fleaValue
					if (isBanned) {
						// For banned items, recalculate flea price.
						fleaValue = this.getFleaPrice(itemID) / slotDensity

						if (config.MarkValueableItems.alwaysMarkBannedItems) {
							fleaValue = config.MarkValueableItems.fleaSlotValueThresholdBest + 1 // always mark flea banned items as best.
						}
					} else {
						fleaValue = fleaPrice / slotDensity
					}

					if (this.items[itemID]._parent != "5795f317245977243854e041") {
						// ignore containers
						if (itemvalue > config.MarkValueableItems.traderSlotValueThresholdBest || fleaValue > config.MarkValueableItems.fleaSlotValueThresholdBest) {
							if (userLocale == "jp" || userLocale == "kr" || config.MarkValueableItems.useAltValueMarks) {
								if (config.MarkValueableItems.addToShortName) {
									this.addToShortName(itemID, config.MarkValueableItems.AltBestValueMark, "prepend")
								}
								if (config.MarkValueableItems.addToName) {
									this.addToName(itemID, config.MarkValueableItems.AltBestValueMark, "append")
								}
							} else {
								if (config.MarkValueableItems.addToShortName) {
									this.addToShortName(itemID, config.MarkValueableItems.BestValueMark, "prepend")
								}
								if (config.MarkValueableItems.addToName) {
									this.addToName(itemID, config.MarkValueableItems.BestValueMark, "append")
								}
							}
						} else if (itemvalue > config.MarkValueableItems.traderSlotValueThresholdGood || fleaValue > config.MarkValueableItems.fleaSlotValueThresholdGood) {
							if (userLocale == "jp" || userLocale == "kr" || config.MarkValueableItems.useAltValueMarks) {
								if (config.MarkValueableItems.addToShortName) {
									this.addToShortName(itemID, config.MarkValueableItems.AltGoodValueMark, "prepend")
								}
								if (config.MarkValueableItems.addToName) {
									this.addToName(itemID, config.MarkValueableItems.AltGoodValueMark, "append")
								}
							} else {
								if (config.MarkValueableItems.addToShortName) {
									this.addToShortName(itemID, config.MarkValueableItems.GoodValueMark, "prepend")
								}
								if (config.MarkValueableItems.addToName) {
									this.addToName(itemID, config.MarkValueableItems.GoodValueMark, "append")
								}
							}
						}
					}
				}

				if (config.PricesInfo.enabled) {
					// prettier-ignore
					priceString += (config.PricesInfo.addFleaPrice ? i18n.Fleaprice + ": " + this.formatPrice(fleaPrice) + (fleaPrice > 0 ? "₽" : "") + " | " : "") + (config.PricesInfo.addItemValue ? i18n.ItemValue + ": " + this.formatPrice(itemInHandbook.Price) + " | " : "")  + i18n.Valuation1 + traderName + i18n.Valuation2 + ": " + this.formatPrice(traderPrice) + "₽" + newLine + newLine;

					// log(priceString)
				}

				if (config.HeadsetInfo.enabled) {
					if (item._props.Distortion !== undefined) {
						const gain = item._props.CompressorGain
						const thresh = item._props.CompressorTreshold
						// prettier-ignore
						headsetDescription = `${i18n.AmbientVolume}: ${item._props.AmbientVolume}dB | ${i18n.Compressor}: ${i18n.Gain} +${gain}dB × ${i18n.Treshold} ${thresh}dB ≈ ×${Math.abs((gain * thresh) / 100)} ${i18n.Boost} | ${i18n.ResonanceFilter}: ${item._props.Resonance}@${item._props.CutoffFreq}Hz | ${i18n.Distortion}: ${Math.round(item._props.Distortion * 100)}%` + newLine + newLine;
						// log(name)
						// log(headsetDescription)
					}
				}

				if (config.BarterInfo.enabled) {
					if (barterInfo.barters.length > 1) {
						barterString = barterInfo.barters + newLine
						// log(name)
						// log(barterString)
					}
				}

				if (config.ProductionInfo.enabled) {
					const productionInfo = this.productionGenarator(itemID, userLocale)
					if (productionInfo.length > 1) {
						productionString = productionInfo + newLine
						// log(name)
						// log(productionString)
					}
				}

				if (config.BarterResourceInfo.enabled) {
					if (barterResourceInfo.length > 1) {
						usedForBarterString = barterResourceInfo + newLine
						// log(name)
						// log(usedForBarterString)
					}
				}

				if (config.QuestInfo.enabled) {
					const itemQuestInfo = this.QuestInfoGenerator(itemID, userLocale)
					if (itemQuestInfo.length > 1) {
						usedForQuestsString = itemQuestInfo + newLine
						// item._props.BackgroundColor = "tracerGreen"
						if (config.QuestInfo.FIRinName && itemQuestInfo.includes("✔")) {
							this.addToName(itemID, "✔", "append")
							this.addToShortName(itemID, "", "prepend") // ✔ is not shown in inventory icon font :(
						}
						// log(this.getItemName(itemID))
						// log(usedForQuestsString)
					}
				}

				if (config.HideoutInfo.enabled) {
					const itemHideoutInfo = this.HideoutInfoGenerator(itemID, userLocale)
					if (itemHideoutInfo.length > 1) {
						usedForHideoutString = itemHideoutInfo + newLine
						// log(name)
						// log(usedForHideoutString)
					}
				}

				if (config.CraftingMaterialInfo.enabled) {
					const itemCraftingMaterialInfo = this.CraftingMaterialInfoGenarator(itemID, userLocale)
					if (itemCraftingMaterialInfo.length > 1) {
						usedForCraftingString = itemCraftingMaterialInfo + newLine
						// log(name)
						// log(usedForCraftingString)
					}
				}

				descriptionString =
					priceString +
					spawnString +
					spawnChanceString +
					headsetDescription +
					armorDurabilityString +
					slotefficiencyString +
					usedForQuestsString +
					usedForHideoutString +
					barterString +
					productionString +
					usedForCraftingString +
					usedForBarterString

				this.addToDescription(itemID, descriptionString, "prepend")

				const debug = false
				if (debug) {
					log(this.getItemName(itemID, userLocale))
					log(descriptionString)
					// log(this.getItemDescription(itemID, userLocale))
					log("---")
				}

				// this.addToName(itemID, "✅✓✔☑🗸⍻√❎❌✖✗✘☒", "append");
			}
		}
		this.logger.success("[Item Info] Finished processing items, enjoy!")
		if (translations.debug.enabled) {
			const debugItemIDlist = [
				"590a3efd86f77437d351a25b",
				"5c0e722886f7740458316a57",
				"5645bcc04bdc2d363b8b4572",
				"590c621186f774138d11ea29",
				"59faff1d86f7746c51718c9c",
				"5c0e625a86f7742d77340f62",
				"5bb20dcad4351e3bac1212da"
			]
			for (const debugItemID of debugItemIDlist) {
				this.logger.info("---")
				this.logger.info(newLine)
				this.logger.info(debugItemID)
				this.logger.info(this.getItemName(debugItemID, translations.debug.languageToDebug))
				this.logger.info(newLine)
				this.logger.info(this.getItemShortName(debugItemID, translations.debug.languageToDebug))
				this.logger.info(newLine)
				this.logger.info(this.getItemDescription(debugItemID, translations.debug.languageToDebug))
			}
		}
	}

	getItemName(itemID: string, locale = "en"): string {
		if (typeof this.locales[locale][`${itemID} Name`] != "undefined") {
			return this.locales[locale][`${itemID} Name`]
		} else if (typeof this.locales["en"][`${itemID} Name`] != "undefined") {
			return this.locales["en"][`${itemID} Name`]
		} else if (typeof this.items[itemID]?._props?.Name != "undefined"){
			return this.items[itemID]._props.Name // If THIS fails, the modmaker REALLY fucked up
		} else {
			return
		}
	}

	getItemShortName(itemID: string, locale = "en"): string {
		if (typeof this.locales[locale][`${itemID} ShortName`] != "undefined") {
			return this.locales[locale][`${itemID} ShortName`]
		} else if (typeof this.locales["en"][`${itemID} ShortName`] != "undefined") {
			return this.locales["en"][`${itemID} ShortName`]
		} else {
			return this.items[itemID]._props.ShortName
		}
	}

	getItemDescription(itemID: string, locale = "en"): string {
		if (typeof this.locales[locale][`${itemID} Description`] != "undefined") {
			return this.locales[locale][`${itemID} Description`]
		} else if (typeof this.locales["en"][`${itemID} Description`] != "undefined") {
			return this.locales["en"][`${itemID} Description`]
		} else {
			return this.items[itemID]._props.Description
		}
	}

	formatPrice(price: number): string {
		if (typeof price == "number" && config.FormatPrice) {
			return Intl.NumberFormat("en-US").format(price)
		} else {
			return price.toString()
		}
	}

	addToName(itemID: string, addToName: string, place: "prepend" | "append", lang = ""): void {
		if (lang == "") {
			// I'm actually really proud of this one! If no lang argument is passed, it defaults to recursion for all languages.
			for (const locale in this.locales) {
				this.addToName(itemID, addToName, place, locale)
			}
		} else {
			const originalName = this.getItemName(itemID, lang)
			switch (place) {
				case "prepend":
					this.locales[lang][`${itemID} Name`] = addToName + originalName
					break
				case "append":
					this.locales[lang][`${itemID} Name`] = originalName + addToName
					break
			}
		}
	}

	addToShortName(itemID: string, addToShortName: string, place: "prepend" | "append", lang = ""): void {
		if (lang == "") {
			for (const locale in this.locales) {
				this.addToShortName(itemID, addToShortName, place, locale)
			}
		} else {
			const originalShortName = this.getItemShortName(itemID, lang)
			switch (place) {
				case "prepend":
					this.locales[lang][`${itemID} ShortName`] = addToShortName + originalShortName
					break
				case "append":
					this.locales[lang][`${itemID} ShortName`] = originalShortName + addToShortName
					break
			}
		}
	}

	addToDescription(itemID: string, addToDescription: string, place: "prepend" | "append", lang = ""): void {
		if (lang == "") {
			for (const locale in this.locales) {
				this.addToDescription(itemID, addToDescription, place, locale)
			}
		} else {
			const originalDescription = this.getItemDescription(itemID, lang)
			switch (place) {
				case "prepend":
					this.locales[lang][`${itemID} Description`] = addToDescription + originalDescription
					break
				case "append":
					this.locales[lang][`${itemID} Description`] = originalDescription + addToDescription
					break
			}
		}
	}

	getItemSlotDensity(itemID: string): number {
		return (this.items[itemID]._props.Width * this.items[itemID]._props.Height) / this.items[itemID]._props.StackMaxSize
	}

	getItemInHandbook(itemID: string): HandbookItem {
		try {
			return this.handbook.Items.find((i) => i.Id === itemID) // Outs: @Id, @ParentId, @Price
		} catch (error) {
			log(error)
		}
	}

	resolveBestTrader(itemID: string, locale = "en") {
		let traderMulti = 0 // AVG fallback
		let traderName = "None"
		// let itemParentID = this.items[itemID]._parent // Unused
		const itemBaseClasses = this.itemBaseClassService.getItemBaseClasses(itemID)
		// log(itemBaseClasses)
		// let handbookCategories = handbook.Categories.filter((i) => i.Id === handbookParentId)[0]

		// traderSellCategory = handbookCategories?.Id // "?" check is for shitty custom items
		// altTraderSellCategory = handbookCategories?.ParentId

		for (const trader of this.traderList) {
			if (
				(trader.base.items_buy.category.some((x) => itemBaseClasses.includes(x)) || trader.base.items_buy.id_list.includes(itemID)) &&
				!trader.base.items_buy_prohibited.id_list.includes(itemID)
			) {
				// items_buy is new to 350 it seems
				traderMulti = (100 - trader.base.loyaltyLevels[0].buy_price_coef) / 100
				//traderName = traderList[i].base.nickname
				traderName = this.locales[locale][`${trader.base._id} Nickname`]
				// log(`${this.getItemName(itemID)} @ ${traderName}`)
				return {
					multi: traderMulti,
					name: traderName
				}
			}
		}

		return {
			multi: traderMulti,
			name: traderName
		}
	}

	getItemBestTrader(itemID: string, locale = "en") {
		const handbookItem = this.getItemInHandbook(itemID)

		// log(handbookItem)
		const bestTrader = this.resolveBestTrader(itemID, locale)
		const result = handbookItem.Price * bestTrader.multi
		return {
			price: result,
			name: bestTrader.name,
			ParentId: handbookItem.ParentId
		}
	}

	getFleaPrice(itemID: string): number {
		if (typeof this.fleaPrices[itemID] != "undefined") {
			// Forgot quotes, typeof returns string..
			return this.fleaPrices[itemID]
		} else if (typeof this.getItemInHandbook(itemID)?.Price != "undefined"){
			return this.getItemInHandbook(itemID).Price
		} else {
			return 0;
		}
	}

	getBestPrice(itemID: string): number {
		if (typeof this.fleaPrices[itemID] != "undefined") {
			return this.fleaPrices[itemID]
		} else {
			return this.getItemBestTrader(itemID).price
		}
	}

	bartersResolver(itemID: string): ResolvedBarter[] {
		const itemBarters: ResolvedBarter[] = []

		try {
			this.traderList.forEach((trader) => {
				const allTraderBarters = trader.assort.items
				const traderBarters = allTraderBarters.filter((x) => x._tpl == itemID)

				const barters = traderBarters
					.map((barter) => recursion(barter)) // find and get list of "parent items" for a passed component
					.map((barter) => ({
						// reset parentItem for actual parent items because of recursion function.
						// can be done in a more elegant way, but i'm too tired after a night of debugging. who cares anyway, it works.
						parentItem: barter.originalItemID ? (barter.originalItemID == itemID ? null : barter.originalItemID) : null,
						barterResources: trader.assort.barter_scheme[barter._id][0],
						barterLoyaltyLevel: trader.assort.loyal_level_items[barter._id],
						traderID: trader.base._id
					}))

				itemBarters.push(...barters)

				function recursion(barter: PlaceholderItem): PlaceholderItem {
					if (barter.parentId == "hideout") {
						return barter
					} else {
						let parentBarter
						try {
							// spent literary 12 hours debugging this feature... KMP.
							// all because of one item, SWORD International Mk-18 not having proper .parentId is assort table. who would have thought. thx Nikita
							parentBarter = allTraderBarters.find((x) => x._id == barter.parentId)
							parentBarter.originalItemID = parentBarter._tpl
						} catch (error) {
							return barter // FML
						}
						return recursion(parentBarter)
					}
				}
			})
		} catch (error) {
			this.logger.warning("\n[ItemInfo] bartersResolver failed because of another mod. Send bug report. Continue safely.")
			log(error)
		}

		return itemBarters
	}

	barterInfoGenerator(itemBarters: ResolvedBarter[], locale = "en") {
		let barterString = ""
		const rarityArray = []
		const prices = []

		for (const barter of itemBarters) {
			let totalBarterPrice = 0
			let totalBarterPriceString = ""
			const traderName = this.locales[locale][`${barter.traderID} Nickname`]
			let partOf = ""

			if (barter.parentItem != null) {
				partOf = ` ∈ ${this.getItemShortName(barter.parentItem, locale)}`
			}

			barterString += `${translations[locale].Bought}${partOf} ${translations[locale].at} ${traderName} ${translations[locale].lv}${barter.barterLoyaltyLevel} < `

			let isBarter = false
			for (const resource of barter.barterResources) {
				if (resource._tpl == "5449016a4bdc2d6f028b456f") {
					const rubles = resource.count
					barterString += `${this.formatPrice(Math.round(rubles))}₽ + `
				} else if (resource._tpl == "569668774bdc2da2298b4568") {
					const euro = resource.count
					barterString += `${this.formatPrice(Math.round(euro))}€ ≈ ${this.formatPrice(Math.round(this.euroRatio * euro))}₽ + `
				} else if (resource._tpl == "5696686a4bdc2da3298b456a") {
					const dollars = resource.count
					barterString += `$${this.formatPrice(Math.round(dollars))} ≈ ${this.formatPrice(Math.round(this.dollarRatio * dollars))}₽ + `
				} else {
					totalBarterPrice += this.getFleaPrice(resource._tpl) * resource.count
					barterString += this.getItemShortName(resource._tpl, locale)
					barterString += ` ×${resource.count} + `
					isBarter = true
				}
			}

			if (isBarter) {
				rarityArray.push(barter.barterLoyaltyLevel + 1)
			} else {
				rarityArray.push(barter.barterLoyaltyLevel)
			}

			if (totalBarterPrice != 0) {
				totalBarterPriceString = ` | Σ ≈ ${this.formatPrice(Math.round(totalBarterPrice))}₽`
			}

			barterString = barterString.slice(0, barterString.length - 3) + totalBarterPriceString + "\n"
		}

		return {
			prices: prices, //TODO
			barters: barterString,
			rarity: rarityArray.length == 0 ? 0 : Math.min(...rarityArray)
		}
	}

	barterResourceInfoGenerator(itemID: string, locale = "en"): string {
		// Refactor this abomination pls
		let baseBarterString = ""
		for (const trader of this.traderList) {
			const traderName = this.locales[locale][`${trader.base._id} Nickname`]
			for (const barterID in trader.assort.barter_scheme) {
				// iterate all seller barters
				for (const srcs in trader.assort.barter_scheme[barterID][0]) {
					if (trader.assort.barter_scheme[barterID][0][srcs]._tpl === itemID) {
						const barterResources = trader.assort.barter_scheme[barterID][0]
						let bartedForItem: string
						let totalBarterPrice = 0
						const barterLoyaltyLevel = trader.assort.loyal_level_items[barterID]

						for (const originalBarter in trader.assort.items) {
							if (trader.assort.items[originalBarter]._id == barterID) {
								bartedForItem = trader.assort.items[originalBarter]._tpl
							}
						}

						baseBarterString += translations[locale].Traded + " ×" + trader.assort.barter_scheme[barterID][0][srcs].count + " "
						baseBarterString +=
							translations[locale].at + " " + traderName + " " + translations[locale].lv + barterLoyaltyLevel + " > " + this.getItemName(bartedForItem, locale)

						let extendedBarterString = " < … + "
						for (const barterResource in barterResources) {
							totalBarterPrice += this.getFleaPrice(barterResources[barterResource]._tpl) * barterResources[barterResource].count
							if (barterResources[barterResource]._tpl != itemID) {
								extendedBarterString += this.getItemShortName(barterResources[barterResource]._tpl, locale)
								extendedBarterString += ` ×${barterResources[barterResource].count} + `
							}
						}

						const barterStringToAppend =
							totalBarterPrice != 0 ? ` | Δ ≈ ${this.formatPrice(Math.round(this.getFleaPrice(bartedForItem) - totalBarterPrice))}₽` : null

						extendedBarterString = extendedBarterString.slice(0, extendedBarterString.length - 3)
						extendedBarterString += barterStringToAppend
						baseBarterString += extendedBarterString + newLine
					}
				}
			}
		}
		return baseBarterString
	}

	getCraftingAreaName(areaType: number, locale = "en"): string {
		const stringName = `hideout_area_${areaType}_name`
		return this.locales[locale][stringName]
	}

	getCraftingRarity(areaType: number, level: number): number {
		for (const s in this.hideoutAreas[areaType].stages) {
			if (Number.parseInt(s) > 1) {
				return level + 1
			} else {
				return 4
			}
		}
	}

	productionGenarator(itemID: string, locale = "en"): string {
		let craftableString = ""
		const rarityArray = []

		for (const recipeId in this.hideoutProduction) {
			if (itemID === this.hideoutProduction[recipeId].endProduct && this.hideoutProduction[recipeId].areaType !== 21) {
				// Find every recipe for itemid and don't use Christmas Tree crafts
				const recipe = this.hideoutProduction[recipeId]
				let componentsString = ""
				let recipeAreaString = this.getCraftingAreaName(recipe.areaType, locale)
				let totalRecipePrice = 0
				let recipeDivision = ""
				let questReq = ""

				for (const requirement of recipe.requirements) {
					if (requirement.type === "Area") {
						recipeAreaString = this.getCraftingAreaName(requirement.areaType, locale) + " " + translations[locale].lv + requirement.requiredLevel
						rarityArray.push(this.getCraftingRarity(requirement.areaType, requirement.requiredLevel))
					}
					if (requirement.type === "Item") {
						const craftComponentId = requirement.templateId
						const craftComponentCount = requirement.count
						const craftComponentPrice = this.getFleaPrice(craftComponentId)

						componentsString += this.getItemShortName(craftComponentId, locale) + " ×" + craftComponentCount + " + "
						totalRecipePrice += craftComponentPrice * craftComponentCount
					}
					if (requirement.type === "Resource") {
						// superwater calculation
						const craftComponentId = requirement.templateId
						const resourceProportion = requirement.resource / this.items[requirement.templateId]._props.Resource
						const craftComponentPrice = this.getFleaPrice(craftComponentId)

						componentsString += this.getItemShortName(craftComponentId, locale) + " ×" + Math.round(resourceProportion * 100) + "%" + " + "
						totalRecipePrice += Math.round(craftComponentPrice * resourceProportion)
					}
					if (requirement.type === "QuestComplete") {
						questReq = ` (${this.locales[locale][`${requirement.questId} name`]}✔)`
					}
				}

				if (recipe.count > 1) {
					recipeDivision = " " + translations[locale].peritem
				}

				componentsString = componentsString.slice(0, componentsString.length - 3)

				if (recipe.endProduct === "59faff1d86f7746c51718c9c") {
					craftableString += `${translations[locale].Crafted} @ ${recipeAreaString}`
					const bitcoinTime = recipe.productionTime
					// prettier-ignore
					craftableString += ` | 1× GPU: ${this.convertTime(this.gpuTime(1, bitcoinTime), locale)}, 10× GPU: ${this.convertTime(this.gpuTime(10, bitcoinTime), locale)}, 25× GPU: ${this.convertTime(this.gpuTime(25, bitcoinTime), locale)}, 50× GPU: ${this.convertTime(this.gpuTime(50, bitcoinTime), locale)}`

					// 					log(`
					// // Base time (x${roundWithPrecision(145000/time, 2)}): ${convertTime(time)}, GPU Boost: x${roundWithPrecision(tables.hideout.settings.gpuBoostRate/0.041225, 2)}
					// // 2× GPU: ${convertTime(gpuTime(2))} x${roundWithPrecision(time/gpuTime(2), 2)}
					// // 10× GPU: ${convertTime(gpuTime(10))} x${roundWithPrecision(time/gpuTime(10), 2)}
					// // 25× GPU: ${convertTime(gpuTime(25))} x${roundWithPrecision(time/gpuTime(25), 2)}
					// // 50× GPU: ${convertTime(gpuTime(50))} x${roundWithPrecision(time/gpuTime(50), 2)}`)
				} else {
					craftableString += `${translations[locale].Crafted} ×${recipe.count} @ ${recipeAreaString}${questReq} < `
					craftableString += `${componentsString} | Σ${recipeDivision} ≈ ${this.formatPrice(Math.round(totalRecipePrice / recipe.count))}₽\n`
				}

				//				function convertTime(time: number, locale = "en"): string {
				//					const hours = Math.trunc(time / 60 / 60)
				//					const minutes = Math.round((time - hours * 60 * 60) / 60)
				//					return `${hours}${this.locales[locale].HOURS} ${minutes}${this.locales[locale].Min}`
				//				}
				//
				//				function gpuTime(gpus: number, time: number): number {
				//					return time / (1 + (gpus - 1) * this.tables.hideout.settings.gpuBoostRate)
				//				}
				// if (fleaPrice > totalRecipePrice/recipe.count) {
				// 	let profit = Math.round(fleaPrice-(totalRecipePrice/recipe.count))
				// 	console.log("Hava Nagila! Profitable craft at " + profit + " profit detected! " + this.GetItemName(id) + " can be crafted at " + recipeAreaString)
				// }
			}
		}
		return craftableString
	}

	convertTime(time: number, locale = "en"): string {
		const hours = Math.trunc(time / 60 / 60)
		const minutes = Math.round((time - hours * 60 * 60) / 60)
		return `${hours}${this.locales[locale].HOURS} ${minutes}${this.locales[locale].Min}`
	}

	gpuTime(gpus: number, time: number): number {
		return time / (1 + (gpus - 1) * this.tables.hideout.settings.gpuBoostRate)
	}

	HideoutInfoGenerator(itemID: string, locale = "en"): string {
		// make it like this
		// const r = data.filter(d => d.courses.every(c => courses.includes(c.id)));

		let hideoutString = ""
		for (const area of this.hideoutAreas) {
			for (const stage in area.stages) {
				for (const requirement of area.stages[stage].requirements) {
					if (requirement.templateId === itemID) {
						hideoutString += `${translations[locale].Need} ×${requirement.count} > ${this.getCraftingAreaName(area.type, locale)} ${
							translations[locale].lv
						}${stage}\n`
					}
				}
			}
		}
		// console.log(hideoutString)
		return hideoutString
	}

	CraftingMaterialInfoGenarator(itemID: string, locale = "en"): string {
		let usedForCraftingString = ""
		// let totalCraftingPrice = 0 // Unused

		for (const recipe of this.hideoutProduction) {
			for (const s in recipe.requirements) {
				if (recipe.requirements[s].templateId === itemID) {
					let usedForCraftingComponentsString = " < … + "
					let recipeAreaString = ""
					let totalRecipePrice = 0
					let questReq = ""

					for (const requirement of recipe.requirements) {
						if (requirement.type == "Area") {
							// prettier-ignore
							recipeAreaString = this.getCraftingAreaName(requirement.areaType, locale) + " " + translations[locale].lv + requirement.requiredLevel
						}
						if (requirement.type == "Item") {
							const craftComponent = requirement
							if (craftComponent.templateId != itemID) {
								usedForCraftingComponentsString += this.getItemShortName(craftComponent.templateId, locale) + " ×" + craftComponent.count + " + "
							}
							totalRecipePrice += this.getFleaPrice(craftComponent.templateId) * craftComponent.count
						}
						if (requirement.type == "Resource") {
							const craftComponent = requirement
							const resourceProportion = craftComponent.resource / this.items[craftComponent.templateId]._props.Resource
							if (craftComponent.templateId != itemID) {
								usedForCraftingComponentsString +=
									this.getItemShortName(craftComponent.templateId, locale) + " ×" + Math.round(resourceProportion * 100) + "%" + " + "
							}
							totalRecipePrice += Math.round(this.getFleaPrice(craftComponent.templateId) * resourceProportion)
						}
						if (requirement.type === "QuestComplete") {
							questReq = ` (${this.locales[locale][`${requirement.questId} name`]}✔) `
						}
					}
					usedForCraftingComponentsString = usedForCraftingComponentsString.slice(0, usedForCraftingComponentsString.length - 3)
					// prettier-ignore
					usedForCraftingComponentsString += ` | Δ ≈ ${this.formatPrice(Math.round(this.getFleaPrice(recipe.endProduct) * recipe.count - totalRecipePrice))}₽`
					// prettier-ignore
					usedForCraftingString += `${recipe.requirements[s].type == "Tool" ? translations[locale].Tool : translations[locale].Part + " ×" + recipe.requirements[s].count} > ${this.getItemName(recipe.endProduct, locale)} ×${recipe.count}`
					usedForCraftingString += ` @ ${recipeAreaString + questReq + usedForCraftingComponentsString}\n`
				}
			}
		}
		// console.log(hideoutString)
		// log (usedForCraftingString)
		return usedForCraftingString
	}

	QuestInfoGenerator(itemID: string, locale = "en"): string {
		let questString = ""
		for (const questID in this.quests) {
			const questName = this.locales[locale][`${questID} name`]

			const questConditions = this.quests[questID].conditions.AvailableForFinish
			for (const condition of questConditions) {
				if (condition.conditionType == "HandoverItem" && condition.target.includes(itemID)) {
					const trader = this.quests[questID].traderId
					//let tradeName = tables.traders[trader].base.nickname
					const traderName = this.locales[locale][`${trader} Nickname`]
					// prettier-ignore
					questString += `${translations[locale].Found} ${condition.onlyFoundInRaid ? "(✔) " : ""}×${condition.value} > ${questName} @ ${traderName}\n`
				}
			}
		}
		return questString
	}
}

function roundWithPrecision(num: number, precision: number): number {
	const multiplier = Math.pow(10, precision)
	return Math.round(num * multiplier) / multiplier
}

const log = (i) => {
	// for my sanity and convenience
	console.log(i)
}

// A silly solution to some weird recursion logic that adds values to an object that shouldn't have them
interface PlaceholderItem extends Item {
	originalItemID?: string
}

interface ResolvedBarter {
	parentItem: string
	barterResources: IBarterScheme[]
	barterLoyaltyLevel: number
	traderID: string
}

module.exports = { mod: new ItemInfo() }
