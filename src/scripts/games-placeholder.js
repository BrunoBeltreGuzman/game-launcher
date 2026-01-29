const fs = require('fs');

const top100Games = [
    "Minecraft", "Grand Theft Auto V", "Tetris", "Wii Sports", "PUBG: Battlegrounds",
    "Super Mario Bros.", "Mario Kart 8 Deluxe", "Red Dead Redemption 2", "Overwatch", "The Witcher 3: Wild Hunt",
    "Pokémon", "Skyrim", "Diablo III", "Terraria", "Animal Crossing: New Horizons",
    "Pac-Man", "Human: Fall Flat", "Wii Fit", "Mario Kart Wii", "Wii Sports Resort",
    "The Legend of Zelda: Breath of the Wild", "Super Mario Odyssey", "Elden Ring", "Fortnite", "Call of Duty: Modern Warfare",
    "Counter-Strike: Global Offensive", "League of Legends", "Dota 2", "World of Warcraft", "Doom",
    "Street Fighter II", "Mortal Kombat", "Sonic the Hedgehog", "Final Fantasy VII", "Metal Gear Solid",
    "Halo: Combat Evolved", "GoldenEye 007", "StarCraft", "Half-Life 2", "Resident Evil 4",
    "The Last of Us", "God of War", "Horizon Zero Dawn", "Cyberpunk 2077", "Fallout 4",
    "BioShock", "Portal 2", "Mass Effect 2", "Dark Souls", "Bloodborne",
    "Sekiro: Shadows Die Twice", "Hollow Knight", "Stardew Valley", "Among Us", "Fall Guys",
    "Roblox", "Apex Legends", "Genshin Impact", "Call of Duty: Warzone", "Rocket League",
    "Destiny 2", "Borderlands 2", "Assassin's Creed II", "Uncharted 2: Among Thieves", "Batman: Arkham City",
    "Red Dead Redemption", "Grand Theft Auto: San Andreas", "Grand Theft Auto: Vice City", "SimCity 2000", "The Sims",
    "Spore", "Age of Empires II", "Civilization VI", "Command & Conquer", "Baldur's Gate 3",
    "Dragon Age: Origins", "The Elder Scrolls IV: Oblivion", "Left 4 Dead 2", "Team Fortress 2", "Garry's Mod",
    "Cuphead", "Undertale", "Celeste", "Hades", "It Takes Two",
    "Crash Bandicoot", "Spyro the Dragon", "Tony Hawk's Pro Skater 2", "Tomb Raider", "Silent Hill 2",
    "Kingdom Hearts", "Monster Hunter: World", "Persona 5", "Final Fantasy X", "Castlevania: Symphony of the Night",
    "Metroid Dread", "Super Smash Bros. Ultimate", "Donkey Kong Country", "Mega Man 2", "Chrono Trigger"
];

const famousGames2025 = [
  "Grand Theft Auto VI", "Monster Hunter Wilds", "Death Stranding 2: On The Beach", "Metroid Prime 4: Beyond", "Ghost of Yotei",
  "Pokémon Legends: Z-A", "Doom: The Dark Ages", "Fable", "South of Midnight", "Mafia: The Old Country",
  "Civilization VII", "Borderlands 4", "Crimson Desert", "Dynasty Warriors: Origins", "Ballad of Antara",
  "Minecraft", "Roblox", "Fortnite", "League of Legends", "Valorant",
  "Counter-Strike 2", "Apex Legends", "Call of Duty: Black Ops 6", "EA Sports FC 25", "NBA 2K25",
  "Elden Ring: Shadow of the Erdtree", "Black Myth: Wukong", "Helldivers 2", "Warhammer 40,000: Space Marine 2", "Baldur's Gate 3",
  "The Legend of Zelda: Echoes of Wisdom", "Super Mario Party Jamboree", "Sonic X Shadow Generations", "Dragon Ball: Sparking! ZERO", "Silent Hill 2",
  "Final Fantasy VII Rebirth", "Stellar Blade", "Tekken 8", "Street Fighter 6", "Mortal Kombat 1",
  "Genshin Impact", "Honkai: Star Rail", "Zenless Zone Zero", "Wuthering Waves", "Blue Protocol",
  "Delta Force", "Marvel Rivals", "FragPunk", "Star Wars Outlaws", "Avatar: Frontiers of Pandora",
  "Hogwarts Legacy", "Cyberpunk 2077: Phantom Liberty", "The Witcher 3: Wild Hunt", "Skyrim", "Red Dead Redemption 2",
  "Stardew Valley", "Terraria", "Hollow Knight: Silksong", "Hades II", "Hyper Light Breaker",
  "Animal Crossing: New Horizons", "Mario Kart 8 Deluxe", "Super Smash Bros. Ultimate", "Splatoon 3", "Among Us",
  "Rocket League", "Fall Guys", "Sea of Thieves", "No Man's Sky", "Rust",
  "DayZ", "Escape from Tarkov", "Path of Exile 2", "Diablo IV", "World of Warcraft: The War Within",
  "Destiny 2", "The First Descendant", "Once Human", "The Finals", "Overwatch 2",
  "Deadlock", "Spectre Divide", "S.T.A.L.K.E.R. 2: Heart of Chornobyl", "Indiana Jones and the Great Circle", "Avowed",
  "Dragon Age: The Veilguard", "Assassin's Creed Shadows", "Ghost Recon: Frontline", "The Sims 4", "InZOI",
  "Skate.", "Life is Strange: Double Exposure", "Until Dawn", "Alan Wake 2", "Control 2",
  "Metaphor: ReFantazio", "Persona 5 Royal", "Like a Dragon: Infinite Wealth", "Kingdom Hearts IV", "Final Fantasy XVI"
];

const gamePath = "C:\\Users\\Admin\\Desktop\\games-placeholder\\";

if (fs.existsSync(gamePath)) {
    fs.rmSync(gamePath, { recursive: true });
    fs.mkdirSync(gamePath);
} else {
    fs.mkdirSync(gamePath);
}
for (const game of [...top100Games, ...famousGames2025]) {
    fs.writeFileSync(gamePath + game + ".lnk", "");
}