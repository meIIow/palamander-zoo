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
  'jelly': ('float', 'curious', 10),
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