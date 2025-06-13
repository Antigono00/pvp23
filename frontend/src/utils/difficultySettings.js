// src/utils/difficultySettings.js - BALANCED DIFFICULTY SYSTEM (50% REDUCTION)
import { 
  getRandomCreatureTemplate, 
  createEnemyCreature 
} from './enemyCreatures';

// ===== BALANCED DIFFICULTY SETTINGS =====
// Reduced by ~50% for more accessible gameplay
export const getDifficultySettings = (difficulty) => {
  const settings = {
    easy: {
      // Easy now requires: 1 Form 2 or 2 Form 1 creatures
      enemyStatsMultiplier: 0.9,      // Reduced from 1.0
      enemyCreatureLevel: {
        min: 0, // More Form 0-1 creatures
        max: 1  // Up to Form 1 creatures
      },
      enemyRarity: {
        common: 0.7,
        rare: 0.2,
        epic: 0.08,
        legendary: 0.02
      },
      initialHandSize: 2,             // Reduced from 3
      enemyDeckSize: 4,               // Reduced from 6
      maxFieldSize: 4,                // Reduced from 5
      enemyAILevel: 1,                // Reduced from 2
      enemyEnergyRegen: 2,            // Reduced from 3
      rewardMultiplier: 0.5,
      multiActionChance: 0.15,        // Reduced from 0.35
      aggressionLevel: 0.3,           // Reduced from 0.5
      startingEnergy: 8,              // Reduced from 10
      bonusStartingItems: 0,          // Reduced from 1
      focusFireChance: 0.2,           // Reduced from 0.4
      comboAwareness: 0.15,           // Reduced from 0.3
      predictiveDepth: 0              // Reduced from 1
    },
    
    medium: {
      // Medium requires: 1 Form 3, 1 Form 1
      enemyStatsMultiplier: 1.0,      // Reduced from 1.1
      enemyCreatureLevel: {
        min: 0, // Form 0-2 creatures
        max: 2
      },
      enemyRarity: {
        common: 0.4,
        rare: 0.35,
        epic: 0.2,
        legendary: 0.05
      },
      initialHandSize: 2,
      enemyDeckSize: 5,               // Reduced from 7
      maxFieldSize: 4,
      enemyAILevel: 2,                // Reduced from 3
      enemyEnergyRegen: 3,            // Same as before
      rewardMultiplier: 1.0,
      multiActionChance: 0.25,        // Reduced from 0.55
      aggressionLevel: 0.4,           // Reduced from 0.65
      startingEnergy: 9,              // Reduced from 11
      bonusStartingItems: 1,          // Reduced from 2
      focusFireChance: 0.3,           // Reduced from 0.6
      comboAwareness: 0.25,           // Reduced from 0.5
      predictiveDepth: 1              // Reduced from 2
    },
    
    hard: {
      // Hard requires: 2 Form 3, 1 Form 2, 1 Form 1
      enemyStatsMultiplier: 1.1,      // Reduced from 1.2
      enemyCreatureLevel: {
        min: 1, // Form 1-3 creatures
        max: 3
      },
      enemyRarity: {
        common: 0.1,
        rare: 0.35,
        epic: 0.4,
        legendary: 0.15
      },
      initialHandSize: 3,             // Reduced from 4
      enemyDeckSize: 6,               // Reduced from 8
      maxFieldSize: 5,                // Reduced from 6
      enemyAILevel: 3,                // Reduced from 4
      enemyEnergyRegen: 3,            // Same as before
      rewardMultiplier: 1.5,
      multiActionChance: 0.4,         // Reduced from 0.75
      aggressionLevel: 0.55,          // Reduced from 0.8
      startingEnergy: 10,             // Reduced from 13
      bonusStartingItems: 2,          // Reduced from 3
      focusFireChance: 0.45,          // Reduced from 0.8
      comboAwareness: 0.4,            // Reduced from 0.7
      predictiveDepth: 2              // Reduced from 3
    },
    
    expert: {
      // Expert requires: 3 Form 3, 2 Form 2, 1 Form 1
      enemyStatsMultiplier: 1.15,     // Reduced from 1.3
      enemyCreatureLevel: {
        min: 1, // Form 1-3 creatures
        max: 3
      },
      enemyRarity: {
        common: 0.05,
        rare: 0.2,
        epic: 0.5,
        legendary: 0.25
      },
      initialHandSize: 3,             // Reduced from 5
      enemyDeckSize: 7,               // Reduced from 10
      maxFieldSize: 5,
      enemyAILevel: 4,                // Reduced from 5
      enemyEnergyRegen: 4,            // Increased from 3 (was same before)
      rewardMultiplier: 2.0,
      multiActionChance: 0.55,        // Reduced from 0.95
      aggressionLevel: 0.7,           // Reduced from 0.95
      startingEnergy: 12,             // Reduced from 15
      bonusStartingItems: 3,          // Reduced from 5
      focusFireChance: 0.6,           // Reduced from 0.95
      comboAwareness: 0.55,           // Reduced from 0.9
      predictiveDepth: 3              // Reduced from 4
    }
  };
  
  return settings[difficulty] || settings.medium;
};

// ===== BALANCED ENEMY CREATURE GENERATION =====
// Generate enemy creatures with moderate power
export const generateEnemyCreatures = (difficulty, count = 5, playerCreatures = []) => {
  const settings = getDifficultySettings(difficulty);
  
  const maxCreatureCount = settings.enemyDeckSize || 5;
  const adjustedCount = Math.min(count, maxCreatureCount);
  
  const creatures = [];

  // Create a pool of species templates from player creatures or use defaults
  const speciesPool = [];
  
  if (playerCreatures && playerCreatures.length > 0) {
    const playerSpeciesIds = new Set();
    
    playerCreatures.forEach(creature => {
      if (creature.species_id) {
        playerSpeciesIds.add(creature.species_id);
      }
    });
    
    Array.from(playerSpeciesIds).forEach(speciesId => {
      speciesPool.push(speciesId);
    });
  }
  
  // ===== BALANCED ENEMY GENERATION WITH FAIR COMPOSITION =====
  for (let i = 0; i < adjustedCount; i++) {
    // Generate a creature with appropriate rarity
    const rarity = selectRarity(settings.enemyRarity);
    
    // Generate form level with more balanced distribution
    let form;
    if (difficulty === 'expert') {
      // Expert: 40% chance for max form (reduced from 80%)
      form = Math.random() < 0.4 ? settings.enemyCreatureLevel.max : 
             Math.floor(Math.random() * (settings.enemyCreatureLevel.max - settings.enemyCreatureLevel.min + 1)) + settings.enemyCreatureLevel.min;
    } else if (difficulty === 'hard') {
      // Hard: 30% chance for max form (reduced from 65%)
      form = Math.random() < 0.3 ? settings.enemyCreatureLevel.max : 
             Math.floor(Math.random() * (settings.enemyCreatureLevel.max - settings.enemyCreatureLevel.min + 1)) + settings.enemyCreatureLevel.min;
    } else if (difficulty === 'medium') {
      // Medium: Balanced distribution
      const rand = Math.random();
      if (rand < 0.2) {
        form = settings.enemyCreatureLevel.max;
      } else if (rand < 0.5) {
        form = Math.max(settings.enemyCreatureLevel.min, settings.enemyCreatureLevel.max - 1);
      } else {
        form = settings.enemyCreatureLevel.min;
      }
    } else {
      // Easy: Lower forms mostly
      form = Math.random() < 0.15 ? settings.enemyCreatureLevel.max : settings.enemyCreatureLevel.min;
    }
    
    // Select a species ID
    let speciesId;
    if (speciesPool.length > 0) {
      speciesId = speciesPool[Math.floor(Math.random() * speciesPool.length)];
    } else {
      const template = getRandomCreatureTemplate();
      speciesId = template.id;
    }
    
    // Generate balanced stats
    const stats = generateEnemyStats(rarity, form, settings.enemyStatsMultiplier);
    
    // Determine specialty stats (fewer specialties)
    let specialtyStats = [];
    
    const statTypes = ['energy', 'strength', 'magic', 'stamina', 'speed'];
    
    // Reduced specialty count based on difficulty
    const specialtyCount = (difficulty === 'expert') ? 
      (Math.random() < 0.4 ? 2 : 1) : // Expert: 40% chance for 2 specialties (reduced from 80% for 3)
      (difficulty === 'hard') ?
      (Math.random() < 0.35 ? 2 : 1) : // Hard: 35% chance for 2 specialties (reduced from 70%)
      (difficulty === 'medium') ?
      (Math.random() < 0.25 ? 2 : 1) : // Medium: 25% chance for 2 specialties (reduced from 50%)
      1;  // Easy: Always 1 specialty
    
    for (let j = 0; j < specialtyCount; j++) {
      const availableStats = statTypes.filter(stat => !specialtyStats.includes(stat));
      const randomStat = availableStats[Math.floor(Math.random() * availableStats.length)];
      specialtyStats.push(randomStat);
    }
    
    // Create the enemy creature
    const creature = createEnemyCreature(speciesId, form, rarity, stats);
    
    // Add specialty stats to the creature
    creature.specialty_stats = specialtyStats;
    
    // Apply evolution boosts
    applyEvolutionBoosts(creature, form);
    
    // Add balanced stat upgrades based on difficulty
    addBalancedStatUpgrades(creature, form, difficulty);
    
    // Add combination bonuses on harder difficulties (reduced chance)
    if (difficulty === 'hard' || difficulty === 'expert') {
      const combinationChance = difficulty === 'expert' ? 0.35 : 0.25; // Reduced from 0.7 and 0.5
      if (Math.random() < combinationChance) {
        const combinationLevel = difficulty === 'expert' ? 
          Math.floor(Math.random() * 2) + 1 : // 1-2 combination levels (reduced from 2-4)
          1;  // 1 combination level (reduced from 1-2)
        creature.combination_level = combinationLevel;
        applyCombinationBonuses(creature, combinationLevel);
      }
    }
    
    creatures.push(creature);
  }
  
  return creatures;
};

// ===== BALANCED ENEMY ITEMS GENERATION =====

/**
 * Generate enemy tools based on difficulty
 */
export const generateEnemyTools = (difficulty, count = 2) => {
  const settings = getDifficultySettings(difficulty);
  const tools = [];
  
  // Balanced tool counts based on difficulty
  const toolCounts = {
    easy: 1,
    medium: 2,
    hard: 2,
    expert: 3
  };
  
  const actualCount = toolCounts[difficulty] || count;
  
  // Tool types and effects
  const toolTypes = ['energy', 'strength', 'magic', 'stamina', 'speed'];
  const toolEffects = ['Surge', 'Shield', 'Echo', 'Drain', 'Charge'];
  
  // Balanced rarity distribution
  const rarityDistribution = {
    easy: { Common: 0.8, Rare: 0.15, Epic: 0.05, Legendary: 0 },
    medium: { Common: 0.5, Rare: 0.35, Epic: 0.13, Legendary: 0.02 },
    hard: { Common: 0.2, Rare: 0.45, Epic: 0.3, Legendary: 0.05 },
    expert: { Common: 0.1, Rare: 0.3, Epic: 0.45, Legendary: 0.15 }
  };
  
  const distribution = rarityDistribution[difficulty] || rarityDistribution.medium;
  
  // Generate strategic tool combinations
  const strategicCombos = [
    { type: 'strength', effect: 'Surge' },    // Attack boost
    { type: 'stamina', effect: 'Shield' },    // Defense boost
    { type: 'magic', effect: 'Echo' },        // Sustained effects
    { type: 'energy', effect: 'Drain' },      // Resource management
    { type: 'speed', effect: 'Charge' }       // Setup plays
  ];
  
  for (let i = 0; i < actualCount; i++) {
    let toolType, toolEffect;
    
    // On higher difficulties, sometimes use strategic combinations
    if ((difficulty === 'hard' || difficulty === 'expert') && Math.random() < 0.35) { // Reduced from 0.7
      const combo = strategicCombos[i % strategicCombos.length];
      toolType = combo.type;
      toolEffect = combo.effect;
    } else {
      toolType = toolTypes[Math.floor(Math.random() * toolTypes.length)];
      toolEffect = toolEffects[Math.floor(Math.random() * toolEffects.length)];
    }
    
    // Generate rarity
    const rarity = selectItemRarity(distribution);
    
    // Create balanced tool object
    const tool = {
      id: `enemy_tool_${Date.now()}_${i}`,
      name: `${rarity} ${toolEffect} ${toolType.charAt(0).toUpperCase() + toolType.slice(1)} Tool`,
      tool_type: toolType,
      tool_effect: toolEffect,
      rarity: rarity,
      image_url: `/assets/tools/${toolType}_${toolEffect.toLowerCase()}.png`,
      description: generateToolDescription(toolType, toolEffect, rarity),
      power_level: calculateBalancedItemPowerLevel(rarity, difficulty),
      usage_cost: 0,
      strategic_value: calculateStrategicValue(toolType, toolEffect, difficulty)
    };
    
    tools.push(tool);
  }
  
  return tools;
};

/**
 * Generate enemy spells based on difficulty
 */
export const generateEnemySpells = (difficulty, count = 2) => {
  const settings = getDifficultySettings(difficulty);
  const spells = [];
  
  // Balanced spell counts
  const spellCounts = {
    easy: 0,
    medium: 1,
    hard: 2,
    expert: 2
  };
  
  const actualCount = spellCounts[difficulty] || count;
  
  // Spell types and effects
  const spellTypes = ['energy', 'strength', 'magic', 'stamina', 'speed'];
  const spellEffects = ['Surge', 'Shield', 'Echo', 'Drain', 'Charge'];
  
  // Balanced rarity distribution for spells
  const rarityDistribution = {
    easy: { Common: 0.7, Rare: 0.25, Epic: 0.05, Legendary: 0 },
    medium: { Common: 0.4, Rare: 0.4, Epic: 0.18, Legendary: 0.02 },
    hard: { Common: 0.1, Rare: 0.4, Epic: 0.4, Legendary: 0.1 },
    expert: { Common: 0.05, Rare: 0.25, Epic: 0.5, Legendary: 0.2 }
  };
  
  const distribution = rarityDistribution[difficulty] || rarityDistribution.medium;
  
  // Generate strategic spell combinations
  const lethalCombos = [
    { type: 'energy', effect: 'Surge' },      // High damage burst
    { type: 'strength', effect: 'Drain' },    // Damage + heal
    { type: 'magic', effect: 'Charge' },      // Delayed devastation
    { type: 'stamina', effect: 'Shield' }     // Team protection
  ];
  
  for (let i = 0; i < actualCount; i++) {
    let spellType, spellEffect;
    
    // On expert, sometimes use optimal spell combinations
    if (difficulty === 'expert' && Math.random() < 0.3) { // Reduced from always
      const combo = lethalCombos[i % lethalCombos.length];
      spellType = combo.type;
      spellEffect = combo.effect;
    } else if (difficulty === 'hard' && Math.random() < 0.2) { // Reduced from 0.6
      const combo = lethalCombos[Math.floor(Math.random() * lethalCombos.length)];
      spellType = combo.type;
      spellEffect = combo.effect;
    } else {
      spellType = spellTypes[Math.floor(Math.random() * spellTypes.length)];
      spellEffect = spellEffects[Math.floor(Math.random() * spellEffects.length)];
    }
    
    // Generate rarity
    const rarity = selectItemRarity(distribution);
    
    // Create balanced spell object
    const spell = {
      id: `enemy_spell_${Date.now()}_${i}`,
      name: `${rarity} ${spellEffect} ${spellType.charAt(0).toUpperCase() + spellType.slice(1)} Spell`,
      spell_type: spellType,
      spell_effect: spellEffect,
      rarity: rarity,
      image_url: `/assets/spells/${spellType}_${spellEffect.toLowerCase()}.png`,
      description: generateSpellDescription(spellType, spellEffect, rarity),
      power_level: calculateBalancedItemPowerLevel(rarity, difficulty),
      mana_cost: 4,
      strategic_value: calculateStrategicValue(spellType, spellEffect, difficulty)
    };
    
    spells.push(spell);
  }
  
  return spells;
};

/**
 * Generate a balanced set of enemy items with strategic diversity
 */
export const generateEnemyItems = (difficulty) => {
  const settings = getDifficultySettings(difficulty);
  
  // Generate base items
  const tools = generateEnemyTools(difficulty);
  const spells = generateEnemySpells(difficulty);
  
  // Add bonus items based on difficulty settings
  const bonusItems = settings.bonusStartingItems || 0;
  
  if (bonusItems > 0) {
    // Add strategic bonus items
    for (let i = 0; i < bonusItems; i++) {
      if (Math.random() < 0.7) {
        // 70% chance for bonus tool
        tools.push(...generateEnemyTools(difficulty, 1));
      } else {
        // 30% chance for bonus spell
        spells.push(...generateEnemySpells(difficulty, 1));
      }
    }
  }
  
  return {
    tools: tools,
    spells: spells
  };
};

// ===== COMPREHENSIVE ENEMY GENERATION =====

/**
 * Generate complete enemy loadout with balanced power
 */
export const generateCompleteEnemyLoadout = (difficulty, creatureCount, playerCreatures = []) => {
  const creatures = generateEnemyCreatures(difficulty, creatureCount, playerCreatures);
  const items = generateEnemyItems(difficulty);
  
  // Calculate total enemy power for balancing
  const totalPower = calculateTotalPower(creatures, items);
  
  return {
    creatures,
    tools: items.tools,
    spells: items.spells,
    difficulty: difficulty,
    settings: getDifficultySettings(difficulty),
    totalPower: totalPower,
    composition: analyzeCreatureComposition(creatures)
  };
};

// ===== BALANCED HELPER FUNCTIONS =====

// Select rarity based on probability distribution
function selectRarity(rarityDistribution) {
  const rnd = Math.random();
  let cumulativeProbability = 0;
  
  for (const [rarity, probability] of Object.entries(rarityDistribution)) {
    cumulativeProbability += probability;
    if (rnd <= cumulativeProbability) {
      return rarity.charAt(0).toUpperCase() + rarity.slice(1);
    }
  }
  
  return 'Common';
}

// Select item rarity
function selectItemRarity(distribution) {
  const random = Math.random();
  let cumulative = 0;
  
  for (const [rarity, probability] of Object.entries(distribution)) {
    cumulative += probability;
    if (random <= cumulative) {
      return rarity;
    }
  }
  
  return 'Common';
}

// Generate balanced stats with moderate scaling
function generateEnemyStats(rarity, form, statsMultiplier) {
  // Balanced base stats for fair challenge
  let baseStats;
  switch (rarity) {
    case 'Legendary':
      baseStats = { energy: 8, strength: 8, magic: 8, stamina: 8, speed: 8 };
      break;
    case 'Epic':
      baseStats = { energy: 7, strength: 7, magic: 7, stamina: 7, speed: 7 };
      break;
    case 'Rare':
      baseStats = { energy: 6, strength: 6, magic: 6, stamina: 6, speed: 6 };
      break;
    default: // Common
      baseStats = { energy: 5, strength: 5, magic: 5, stamina: 5, speed: 5 };
  }
  
  // Apply balanced difficulty multiplier
  const stats = {};
  for (const [stat, value] of Object.entries(baseStats)) {
    // Apply the difficulty multiplier with minimal variance for consistency
    const variance = 0.98 + (Math.random() * 0.04); // ±2% variance
    stats[stat] = Math.round(value * statsMultiplier * variance);
    
    // Ensure stats are within reasonable bounds
    stats[stat] = Math.max(1, Math.min(15, stats[stat]));
  }
  
  return stats;
}

// Apply evolution boosts to creature stats
function applyEvolutionBoosts(creature, form) {
  if (!creature || !creature.stats) return;
  
  const stats = creature.stats;
  
  // Balanced evolution bonuses
  if (form >= 1) {
    Object.keys(stats).forEach(stat => {
      stats[stat] += 1; // Reduced from 2
    });
  }
  
  if (form >= 2) {
    Object.keys(stats).forEach(stat => {
      stats[stat] += 1; // Reduced from 2
      
      // Extra boost to specialty stats
      if (creature.specialty_stats && creature.specialty_stats.includes(stat)) {
        stats[stat] += 1; // Reduced from 2
      }
    });
  }
  
  if (form >= 3) {
    Object.keys(stats).forEach(stat => {
      stats[stat] += 2; // Reduced from 3
    });
  }
}

// Add balanced stat upgrades
function addBalancedStatUpgrades(creature, form, difficulty) {
  if (!creature || !creature.stats) return;
  
  const stats = creature.stats;
  
  // Balanced upgrade amounts
  let totalUpgrades = form * 2; // Reduced from 5
  
  // Add fewer upgrades for harder difficulties
  switch (difficulty) {
    case 'easy':
      totalUpgrades += 1;
      break;
    case 'medium':
      totalUpgrades += 2;
      break;
    case 'hard':
      totalUpgrades += 3;
      break;
    case 'expert':
      totalUpgrades += 4;
      break;
  }
  
  // Apply upgrades with moderate bias toward specialty stats
  for (let i = 0; i < totalUpgrades; i++) {
    let statToUpgrade;
    
    // 50% chance to upgrade a specialty stat (reduced from 70%)
    if (creature.specialty_stats && creature.specialty_stats.length > 0 && Math.random() < 0.5) {
      statToUpgrade = creature.specialty_stats[Math.floor(Math.random() * creature.specialty_stats.length)];
    } else {
      const availableStats = Object.keys(stats);
      statToUpgrade = availableStats[Math.floor(Math.random() * availableStats.length)];
    }
    
    stats[statToUpgrade] += 1;
  }
  
  // Apply minimum stat thresholds based on difficulty (reduced)
  const minStats = {
    easy: 3,
    medium: 4,
    hard: 5,
    expert: 6
  };
  
  const minStat = minStats[difficulty] || 3;
  Object.keys(stats).forEach(stat => {
    if (stats[stat] < minStat) {
      stats[stat] = minStat;
    }
  });
}

// Apply balanced combination bonuses
function applyCombinationBonuses(creature, combinationLevel) {
  if (!creature || !creature.stats || !creature.specialty_stats) return;
  
  const stats = creature.stats;
  
  // Balanced bonuses per combination level
  creature.specialty_stats.forEach(stat => {
    if (stats[stat] !== undefined) {
      stats[stat] += combinationLevel; // Reduced from 2
    }
  });
  
  // Add general stat boost for high combination levels
  if (combinationLevel >= 3) {
    Object.keys(stats).forEach(stat => {
      stats[stat] += 1; // Same as before
    });
  }
  
  creature.combination_level = combinationLevel;
}

// Calculate balanced item power level
function calculateBalancedItemPowerLevel(rarity, difficulty) {
  let basePower = 1.0;
  
  // Balanced rarity multipliers
  switch (rarity) {
    case 'Legendary': basePower = 1.5; break; // Reduced from 2.0
    case 'Epic': basePower = 1.35; break; // Reduced from 1.7
    case 'Rare': basePower = 1.2; break; // Reduced from 1.4
    case 'Common': basePower = 1.0; break;
  }
  
  // Balanced difficulty multipliers
  const difficultyMultipliers = {
    easy: 0.9,
    medium: 1.0,
    hard: 1.1,
    expert: 1.2
  };
  
  return basePower * (difficultyMultipliers[difficulty] || 1.0);
}

// Calculate strategic value of items
function calculateStrategicValue(type, effect, difficulty) {
  let value = 0;
  
  // Base value by effect
  const effectValues = {
    'Surge': 20,    // Immediate impact (reduced from 30)
    'Shield': 25,   // Protection value (reduced from 35)
    'Echo': 18,     // Long-term value (reduced from 25)
    'Drain': 28,    // Versatile effect (reduced from 40)
    'Charge': 30    // High potential (reduced from 45)
  };
  
  value += effectValues[effect] || 15;
  
  // Type synergies
  const typeSynergies = {
    'energy-Drain': 5,
    'strength-Surge': 5,
    'magic-Echo': 5,
    'stamina-Shield': 5,
    'speed-Charge': 5
  };
  
  value += typeSynergies[`${type}-${effect}`] || 0;
  
  // Difficulty bonus (reduced)
  const difficultyBonus = {
    easy: 0,
    medium: 2,
    hard: 4,
    expert: 6
  };
  
  value += difficultyBonus[difficulty] || 0;
  
  return value;
}

// Generate tool descriptions
function generateToolDescription(toolType, toolEffect, rarity) {
  const rarityAdjectives = {
    Common: 'basic',
    Rare: 'enhanced',
    Epic: 'powerful',
    Legendary: 'legendary'
  };
  
  const typeDescriptions = {
    energy: 'energy manipulation',
    strength: 'physical enhancement',
    magic: 'magical amplification',
    stamina: 'endurance boosting',
    speed: 'agility enhancement'
  };
  
  const effectDescriptions = {
    Surge: 'provides a powerful but temporary boost',
    Shield: 'offers protective enhancement',
    Echo: 'creates lasting effects over time',
    Drain: 'converts defensive power to offense',
    Charge: 'builds up power for devastating results'
  };
  
  const adjective = rarityAdjectives[rarity] || 'basic';
  const typeDesc = typeDescriptions[toolType] || 'enhancement';
  const effectDesc = effectDescriptions[toolEffect] || 'enhances abilities';
  
  return `A ${adjective} tool for ${typeDesc} that ${effectDesc}.`;
}

// Generate spell descriptions
function generateSpellDescription(spellType, spellEffect, rarity) {
  const rarityAdjectives = {
    Common: 'minor',
    Rare: 'potent',
    Epic: 'powerful',
    Legendary: 'legendary'
  };
  
  const typeDescriptions = {
    energy: 'energy',
    strength: 'force',
    magic: 'arcane',
    stamina: 'vitality',
    speed: 'temporal'
  };
  
  const effectDescriptions = {
    Surge: 'unleashes immediate powerful effects',
    Shield: 'creates protective magical barriers',
    Echo: 'resonates with lasting magical effects',
    Drain: 'siphons life force and power',
    Charge: 'builds magical energy for explosive release'
  };
  
  const adjective = rarityAdjectives[rarity] || 'minor';
  const typeDesc = typeDescriptions[spellType] || 'magical';
  const effectDesc = effectDescriptions[spellEffect] || 'affects the target';
  
  return `A ${adjective} ${typeDesc} spell that ${effectDesc}.`;
}

// Calculate total power of enemy forces
function calculateTotalPower(creatures, items) {
  let totalPower = 0;
  
  // Calculate creature power
  creatures.forEach(creature => {
    const statSum = Object.values(creature.stats || {}).reduce((sum, stat) => sum + stat, 0);
    const formBonus = (creature.form || 0) * 15; // Reduced from 20
    const rarityBonus = { 'Legendary': 30, 'Epic': 23, 'Rare': 15, 'Common': 8 }[creature.rarity] || 8;
    totalPower += statSum + formBonus + rarityBonus;
  });
  
  // Calculate item power
  const itemPower = (items.tools.length * 15) + (items.spells.length * 20); // Reduced from 20 and 30
  totalPower += itemPower;
  
  return totalPower;
}

// Analyze creature composition
function analyzeCreatureComposition(creatures) {
  const composition = {
    form0: 0,
    form1: 0,
    form2: 0,
    form3: 0,
    averageStats: 0,
    rarityBreakdown: {
      Common: 0,
      Rare: 0,
      Epic: 0,
      Legendary: 0
    }
  };
  
  let totalStats = 0;
  
  creatures.forEach(creature => {
    // Count forms
    const form = creature.form || 0;
    composition[`form${form}`]++;
    
    // Count rarity
    composition.rarityBreakdown[creature.rarity]++;
    
    // Sum stats
    const statSum = Object.values(creature.stats || {}).reduce((sum, stat) => sum + stat, 0);
    totalStats += statSum;
  });
  
  composition.averageStats = Math.round(totalStats / Math.max(creatures.length, 1));
  
  return composition;
}

// NEW: Get balanced difficulty tips
export const getDifficultyTips = (difficulty) => {
  const tips = {
    easy: [
      "Enemy creatures are 10% weaker than yours",
      "AI makes basic tactical decisions",
      "Can win with 1 Form 2 or 2 Form 1 creatures",
      "Good for learning game mechanics"
    ],
    medium: [
      "Enemy creatures match your power level",
      "AI uses items strategically",
      "Recommended: 1 Form 3, 1 Form 1 creature",
      "Provides a balanced challenge"
    ],
    hard: [
      "Enemy creatures are 10% stronger",
      "AI uses advanced tactics and combos",
      "Recommended: 2 Form 3, 1 Form 2, 1 Form 1 creature",
      "Requires good team composition and strategy"
    ],
    expert: [
      "Enemy creatures are 15% stronger with good items",
      "AI plays with sophisticated strategies",
      "Recommended: 3 Form 3, 2 Form 2, 1 Form 1 creature",
      "Challenging but fair with proper preparation"
    ]
  };
  
  return tips[difficulty] || tips.medium;
};

// NEW: Calculate balanced difficulty rating
export const calculateDifficultyRating = (playerCreatures, difficulty) => {
  // Calculate player composition
  const playerComposition = analyzeCreatureComposition(playerCreatures);
  
  // Define minimum requirements for each difficulty (reduced by ~50%)
  const requirements = {
    easy: { form3: 0, form2: 1, form1: 1, avgStats: 25 },
    medium: { form3: 1, form2: 0, form1: 1, avgStats: 35 },
    hard: { form3: 2, form2: 1, form1: 1, avgStats: 45 },
    expert: { form3: 3, form2: 2, form1: 1, avgStats: 55 }
  };
  
  const req = requirements[difficulty] || requirements.medium;
  
  // Check if player meets requirements
  const meetsRequirements = 
    playerComposition.form3 >= req.form3 &&
    playerComposition.form2 >= req.form2 &&
    playerComposition.form1 >= req.form1 &&
    playerComposition.averageStats >= req.avgStats;
  
  // Calculate power differential
  const playerPower = playerCreatures.reduce((total, creature) => {
    const statSum = Object.values(creature.stats || {}).reduce((sum, stat) => sum + stat, 0);
    const formBonus = (creature.form || 0) * 15; // Reduced from 20
    const rarityBonus = { 'Legendary': 30, 'Epic': 23, 'Rare': 15, 'Common': 8 }[creature.rarity] || 8;
    return total + statSum + formBonus + rarityBonus;
  }, 0) / Math.max(playerCreatures.length, 1);
  
  const difficultyMultipliers = {
    easy: 0.9,
    medium: 1.0,
    hard: 1.1,
    expert: 1.15
  };
  
  const enemyPower = playerPower * (difficultyMultipliers[difficulty] || 1.0);
  
  return {
    playerRating: Math.round(playerPower),
    enemyRating: Math.round(enemyPower),
    meetsRequirements: meetsRequirements,
    balanced: meetsRequirements,
    composition: playerComposition,
    recommendation: meetsRequirements ? 
      `Your team composition is suitable for ${difficulty} difficulty.` :
      `Consider improving your team composition for ${difficulty} difficulty. You may want stronger creatures or try a lower difficulty.`
  };
};
