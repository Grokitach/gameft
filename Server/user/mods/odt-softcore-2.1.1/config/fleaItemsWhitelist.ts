const questKeys = [
	// Whitelist for quest keys
	"59387a4986f77401cc236e62", // Dorm room 114 key
	// "5938603e86f77435642354f4", // Dorm room 206 key
	// "5938504186f7740991483f30", // Dorm room 203 key
	"5780cf942459777df90dcb72", // Dorm room 214 key
	"5780cfa52459777dfb276eb1", // Dorm room 220 key
	"593aa4be86f77457f56379f8", // Dorm room 303 key
	// "5780cf7f2459777de4559322", // Dorm room 314 marked key, lol, nope
	// "5937ee6486f77408994ba448", // Machinery key
	// "5780d0532459777a5108b9a2", // Tarcone Director's office key
	"5938144586f77473c2087145", // Portable bunkhouse key
	// "5913611c86f77479e0084092", // Trailer park portable cabin key
	// "593962ca86f774068014d9af", // Unknown key
	"5448ba0b4bdc2d02308b456c", // Factory emergency exit key
	"5ad5cfbd86f7742c825d6104", // OLI logistics department office key
	"5ad5db3786f7743568421cce", // EMERCOM medical unit key
	"5ad7247386f7747487619dc3", // Goshan cash register key
	// "5c94bbff86f7747ee735c08f", // TerraGroup Labs access keycard
	"5efde6b4f5448336730dbd61", // Keycard with a blue marking
	"5c1d0c5f86f7744bb2683cf0", // TerraGroup Labs keycard (Blue)
	"5c1d0dc586f7744baf2e7b79", // TerraGroup Labs keycard (Green)
	"62987c658081af308d7558c6", // Radar station commandant room key
	"62987da96188c076bc0d8c51", // Operating room key
	"5d947d4e86f774447b415895", // RB-KSM key
	"5d80c6c586f77440351beef1", // RB-OB key
	"5d80ccac86f77470841ff452", // RB-ORB1 key
	"5d80ccdd86f77474f7575e02", // RB-ORB2 key
	"5d80cd1a86f77402aa362f42", // RB-ORB3 key
	"5d947d3886f774447b415893", // RB-SMP key
	"5d9f1fa686f774726974a992", // RB-ST key
	"5a0448bc86f774736f14efa8", // Key to the closed premises of the Health Resort
	"5a0eb6ac86f7743124037a28", // Cottage back door key
	"5a0ea79b86f7741d4a35298e", // Health Resort universal utility room key
	"5a0dc95c86f77452440fc675", // Health Resort west wing office room 112 key
	"5a0ee30786f774023b6ee08f", // Health Resort west wing room 216 key
	"5a13ef0686f7746e5a411744", // Health Resort west wing room 219 key
	"5a0ee34586f774023b6ee092", // Health Resort west wing room 220 key
	"5a13f46386f7741dd7384b04", // Health Resort west wing room 306 key
	"5eff09cd30a7dc22fd1ddfed", // Health Resort office key with a blue tape
	"5a145d4786f7744cbb6f4a12", // Health Resort east wing room 306 key
	"5a145d7b86f7744cbb6f4a13", // Health Resort east wing room 308 key
	"5a0eee1486f77402aa773226", // Health Resort east wing room 328 key
	"591afe0186f77431bd616a11", // ZB-014 key
	// "5d08d21286f774736e7c94c3", // Shturman's stash key
	// New 3.5.0 Streets keys
	"63a39f08cd6db0635c197600", // Hotel room 215 key
	"63a39c7964283b5e9c56b280", // Concordia security room key
	// "63a39e1d234195315d4020bd", // Primorsky 46-48 skybridge key (should be guaranteed to spawn, needs testing in SPT),
	"63a397d3af870e651d58e65b", // Car dealership closed section key
	"63a399193901f439517cafb6", // Car dealership director's office room key
	"63a39f18c2d53c2c6839c1d3", // Hotel room 206 key
	"6398fd8ad3de3849057f5128", // Backup hideout key (should be guaranteed to spawn, needs testing in SPT),
	"63a39f6e64283b5e9c56b289", // Iron gate key
	"63a39fc0af870e651d58e6ae", // Chekannaya 15 apartment key
	"5938504186f7740991483f30", // Dorm room 203 key
	"5913877a86f774432f15d444", // Gas station storage room key
];

const itemWhitelist = [
	// Whitelist for items that can be bartered FOR on flea, outside of fleaWhitelist categories
	"60363c0c92ec1c31037959f5", // GP-7 gas mask
	"5fd4c5477a8d854fa0105061", // Security vest
	"5f5e45cc5021ce62144be7aa", // LolKek 3F Transfer tourist backpack
	"5780cf722459777a5108b9a1", // Dorm room 308 key
	"59e770b986f7742cbd762754", // Anti-fragmentation glasses
	"572b7fa524597762b747ce82", // Lower half-mask
	"5b4329075acfc400153b78ff", // Pompon hat
	"59e7708286f7742cbd762753", // Ushanka ear flap hat
	"5e54f79686f7744022011103", // Pestily plague mask
	"5b4326435acfc433000ed01d", // Neoprene mask
	"5b432c305acfc40019478128", // GP-5 gas mask
	"5aa2b923e5b5b000137b7589", // Round frame sunglasses
	"5c0d2727d174af02a012cf58", // PSh-97 DJETA riot helmet
	"57e26fc7245977162a14b800", // Bars A-2607 95H18 knife
	"57e26ea924597715ca604a09", // Bars A-2607 Damascus knife
	"61c18db6dfd64163ea78fbb4", // Leather cap
	"56e33634d2720bd8058b456b", // Duffle bag
	"5f60cd6cf2bcbb675b00dac6", // Walker's XCEL 500BT Digital headset
	"5c165d832e2216398b5a7e36", // Peltor Tactical Sport headset
	"5e4d34ca86f774264f758330", // Walker's Razor Digital headset
	"628e4e576d783146b124c64d", // Peltor ComTac 4 Hybrid
	"5aa2b9ede5b5b000137b758b", // Kinda cowboy hat
	// "5c0e655586f774045612eeb2", // HighCom Trooper TFO body armor (Multicam)
	"579204f224597773d619e051", // Makarov PM (t) 9x18PM pistol
	"5c010e350db83400232feec7", // SP-8 Survival Machete
	"5656eb674bdc2d35148b457c", // 40mm VOG-25 grenade
	"5783c43d2459774bbe137486", // Simple wallet
	"54491bb74bdc2d09088b4567", // ER FULCRUM BAYONET
	"5aa2b9aee5b5b00015693121", // RayBench Hipster Reserve sunglasses
	"5ab8f85d86f7745cd93a1cf5", // Арафатка (Зеленая)",
	"5ab8f4ff86f77431c60d91ba", // Балаклава Призрак,
	"55d614004bdc2d86028b4568", // SureFire SOCOM556-MONSTER 5.56x45 sound suppressor
];

const markedKeys = [
	"62987dfc402c7f69bf010923", // Shared bedroom marked key
	"5780cf7f2459777de4559322", // Dorm room 314 marked key
	"5d80c60f86f77440373c4ece", // RB-BK marked key
	"5d80c62a86f7744036212b3f", // RB-VO marked key
	"5ede7a8229445733cb4c18e2", // RB-PKPM marked key
	"63a3a93f8a56922e82001f5d", // Abandoned factory marked key
	"64ccc25f95763a1ae376e447", // Mysterious room marked key"
];

module.exports = { questKeys, itemWhitelist, markedKeys };
