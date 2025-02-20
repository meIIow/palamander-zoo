import json

# Pal Spec Configuration

def createDefaultSection(type: str):
  return {
    'type': type,
    'count': 10,
    'size': 100,
    'index': 0,
    'angle': 0,
    'offset': 0,
    'mirror': False,
    'next': None,
    'branches': [],
  }

def createDefaultPalamanderSpec(type: str):
  return {
    'type': type,
    'sectionTree': createDefaultSection(type),
    'movementBehavior': {
      'linear': { 'id': '' },
      'rotational': { 'id': '' },
    },
    'updateInterval': 50,
    'magnification': 10,
  }

def configurePalamanderSpec(type: str, linear: str, angular: str, mag: int):
  behavior = {
    'linear': linear,
    'rotational': angular,
  }
  return { **createDefaultPalamanderSpec(type), 'movementBehavior': behavior, 'magnification': mag }


pals = {
  # type: (linear, angular, magnification)
  'axolotl': ('flitting', 'twirling', 10),
  'caterpillar': ('pushing', 'wary', 8),
  'centipede': ('erratic', 'twirling', 8),
  'crawdad': ('pushing', 'wary', 5),
  'frog': ('flitting', 'curious', 10),
  'horshoe-crab': ('flitting', 'curious', 10),
  'jelly': ('hovering', 'curious', 10),
  'wyrm': ('cautious', 'coiling', 6),
  'nautilus': ('flitting', 'wary', 10),
  'newt': ('flitting', 'twirling', 10),
  'newt-king': ('deliberate', 'curious', 10),
  'octopus': ('flitting', 'curious', 10),
  'sea-monkey': ('deliberate', 'wary', 10),
  'sea-lion': ('flitting', 'curious', 10),
  'snake': ('predatory', 'coiling', 8),
  'tadpole': ('flitting', 'twirling', 10),
  'starfish': ('hovering', 'twirling', 10),
}

for type in pals:
  pals[type] = configurePalamanderSpec(type, *pals[type])

with open('./../client/public/pals.json', 'w') as f:
  f.write(json.dumps(pals))


# Pal Modifier Configuration

def configurePalamanderMods(type: str, color: str, opacity: int):
  return {
    'color': color,
    'opacity': opacity,
  }

mods = {
  # type: (color, opacity)
  'axolotl': ('#F096C8', 0.9),
  'caterpillar': ('#48E628', 1),
  'centipede': ('#6F0606', 1),
  'crawdad': ('#273663', 1),
  'frog': ('#5EC328', 1),
  'horshoe-crab': ('#2A2727', 1),
  'jelly': ('#3ED1E5', 0.5),
  'wyrm': ('#7E2020', 0.8),
  'nautilus': ('#E37B35', 1),
  'newt': ('#000000', 0.9),
  'newt-king': ('#000000', 0.9),
  'octopus': ('#A10EB4', 1),
  'sea-monkey': ('#453030', 1),
  'sea-lion': ('#C7CA21', 1),
  'snake': ('#1E3012', 1),
  'tadpole': ('#264804', 0.9),
  'starfish': ('#F07ABF', 1),
}

for type in mods:
  mods[type] = configurePalamanderMods(type, *mods[type])

with open('./../client/public/mods.json', 'w') as f:
  f.write(json.dumps(mods))


# Pal Text

bio = {
  # type: text
  'axolotl': 'He is so much more than a cute lil’ guy. He’s also a squiggly boy - a sweetie pie - a winsome fellow. A cherub too. If they only knew his multitudes…',
  'caterpillar': 'This insatiable hunger. This gnawing emptiness. Sunlight bleeds through hole-munched leaves. Flowers starve and wither as you feast. And still - it is not enough.',
  'centipede': 'Technically a ventipede - but who can count that high anyway? Kids love ‘em. Cobblers love ‘em. Entomologists love ‘em. I… just can’t get past those scuttling legs.',
  'crawdad': 'Your omnipotent Crawpa. Around the world… to the moon… beyond the stars… into this tangle of nylon net. You’d follow him anywhere - you chewy morsel, you.',
  'frog': 'A brash young heir who ran afoul of the voodoo queen. He’s always been slimy, cold, and ugly. Now the bayou rings with his desperate plea: “ribbit!?”',
  'horshoe-crab': 'Predates its namesake lawn game by a mere 250 million years. You may not like it, but this is what peak performance looks like.',
  'jelly': 'It was time to hang up the gloves for good. He could float, he could sting - but Coach was right. He was just too soft. He lacked that animalistic instinct.',
  'wyrm': 'What lurks in the bowels of the earth? Formless nightmares of festering malice. Agents of the abyss. Fragments of unfathomable Before. And also - these chummy goobers.',
  'nautilus': 'Observer detected. Assessing threat level. Sapience… confirmed. Morality… insufficient. Danger… immeasurable. Engage protocol 9. Weapon system online. Target locked.',
  'newt': 'It’s not easy being eponymous. The expectations. The pressure. The scrutiny. It’s enough to make you… flit joyfully across a computer screen.',
  'newt-king': 'Heavy is the head that wears the crown. Good thing there is strength in numbers. For real though - are you sure this water’s safe to drink?',
  'octopus': 'Don’t feel inadequate, my hexapedal friend. Six is plenty - even rounding up. Eight is probably too much anyway. No I’m not “just saying” that!',
  'sea-monkey': 'They lock eyes through the glass. Shamu’s captive heart beats free. Koko drinks in every curve. Is this love – or madness? It hardly matters.',
  'sea-lion': 'You have won. Take my claws and fangs. My hide and paws. My strength, my speed, my freedom. Shape me to your will. Just please - spare this tired king his Pride.',
  'snake': '“You snake!” Blood pumps hot - then cold - with betrayal. Eyes dim. One jaw unclenches - another unhinges. At last, a gentle whisssper: “well, what did you exssspect?”',
  'tadpole': 'The human condition writ small. Dry Land – the impossible dream of a limbless, lungless fool. Must we change our very selves to conquer it?',
  'starfish': 'Starfish or sea stars are star-shaped echinoderms belonging to the class Asteroidea. They are found from the intertidal zone down to abyssal depths, at 6,000m below the surface.',
}

with open('./../client/public/bio.json', 'w') as f:
  f.write(json.dumps(bio))