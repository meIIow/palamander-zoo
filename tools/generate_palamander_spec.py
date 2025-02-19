import json

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

# print(pals)

with open('./../client/public/pals.json', 'w') as f:
  f.write(json.dumps(pals))