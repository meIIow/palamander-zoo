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
    'sectionTree': createDefaultSection(type),
    'movementBehavior': {
      'linear': { 'id': '', 'velocity': 0, 'interval': 0 },
      'angular': { 'id': '', 'velocity': 0, 'interval': 0 },
    },
    'suppressMove': { 'speed': False, 'turn': False },
    'updateInterval': 50,
    'magnification': 10,
  }

pals = {
  'axolotl': { **createDefaultPalamanderSpec('axolotl') },
  'newt': { **createDefaultPalamanderSpec('newt') },
  'frog': { **createDefaultPalamanderSpec('frog') },
  'centipede': { **createDefaultPalamanderSpec('centipede'), 'magnification': 8 },
  'sea-monkey': { **createDefaultPalamanderSpec('sea-monkey') },
  'sea-lion': { **createDefaultPalamanderSpec('sea-lion') },
  'starfish': { **createDefaultPalamanderSpec('starfish') },
  'octopus': { **createDefaultPalamanderSpec('octopus') },
  'crawdad': { **createDefaultPalamanderSpec('crawdad'), 'magnification': 5 },
  'horshoe-crab': { **createDefaultPalamanderSpec('horshoe-crab') },
  'caterpillar': { **createDefaultPalamanderSpec('caterpillar'), 'magnification': 8 },
  'tadpole': { **createDefaultPalamanderSpec('tadpole') },
  'newt-king': { **createDefaultPalamanderSpec('newt-king') },
  'jelly': { **createDefaultPalamanderSpec('jelly') },
}

with open('./../client/public/pals.json', 'w') as f:
  f.write(json.dumps(pals))