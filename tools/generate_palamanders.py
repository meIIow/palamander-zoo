import json

def create_default_segment(radius: int, propagationInterval: int = 100):
  return {
    'radius': radius,
    'bodyAngle': {
      'relative': 0,
      'absolute': 0,
      'curveRange': 0,
    },
    'wriggle': [],
    'overlap': 0,
    'propagationInterval': propagationInterval,
    'children': []
  }

# Creates a wriggle spec to all curl together, like an octopus or a starfish arm.
# If the range * (section length) >= 360, it will form a circle at (absolute) max curl.
def to_curl_spec(range, period, i, offset=0):
  return {
    'range': range,
    'period': period,
    'i': i,
    'squiggleRate': 0,
    'offset': offset,
    'synchronize': True
  }

# Creates a wriggle spec to squiggle like a snake.
# For a full standing wave (the start and end segment in place while the rest squiggle between):
#   set the length to the length of the section.
# For a more realistic snake/tadpole wriggle, set it to half or less.
def to_squiggle_spec(range, period, i, length, offset=0):
  return {
    'range': range,
    'period': period,
    'i': i,
    'squiggleRate': 1 / length,
    'offset': offset,
    'synchronize': False
  }

# Keeps a section of segments in a perfect line, with the whole line rotating back and forth.
def to_rotation_spec(range, period, offset=0):
  return {
    'range': range,
    'period': period,
    'i': 0,
    'squiggleRate': 0,
    'offset': offset,
    'synchronize': False
  }

def add_leg(parent, radius, length, angle, offset):
  curr = parent
  for i in range(length):
    x = create_default_segment(radius)
    x['bodyAngle']['relative'] = angle
    x['bodyAngle']['curveRange'] = 100
    x['wriggle'] = [to_rotation_spec(45, 2, offset)]
    curr['children'].append(x)
    curr = x

def add_spike(parent, radius, length, angle):
  curr = parent
  taper = radius / length
  for i in range(length):
    x = create_default_segment(radius)
    x['bodyAngle']['relative'] = angle
    x['bodyAngle']['curveRange'] = 100
    x['wriggle'] = []
    curr['children'].append(x)
    curr = x
    radius -= taper

def add_octo_arm(parent, radius, length, angle, taper_factor, offset):
  curr = parent
  for i in range(length):
    radius = radius * taper_factor
    x = create_default_segment(radius)
    x['bodyAngle']['relative'] = angle
    x['bodyAngle']['curveRange'] = 100
    x['wriggle'] = [to_curl_spec(120/length, 2, i, offset)]
    x['overlap'] = radius / 2
    curr['children'].append(x)
    curr = x

def add_tapered_snake(parent, radius, length, angle, taper_factor, overlapMult=0):
  curr = parent
  for i in range(length):
    radius = radius * taper_factor
    x = create_default_segment(radius)
    x['bodyAngle']['relative'] = angle
    x['bodyAngle']['curveRange'] = 100
    x['wriggle'] = [to_squiggle_spec(10, 1, i, length*2)]
    x['overlap'] = overlapMult * radius
    curr['children'].append(x)
    curr = x
  return curr

def add_frill(parent, radius, length, angle):
  curr = parent
  for i in range(length):
    x = create_default_segment(radius)
    x['bodyAngle']['relative'] = angle if i == 0 else 0
    x['bodyAngle']['curveRange'] = 100
    x['wriggle'] = [to_squiggle_spec(10, 5, i, length*10)]
    x['overlap'] = 0
    curr['children'].append(x)
    curr = x

def create_tadpole():
  head = create_default_segment(20)
  add_tapered_snake(head, 15, 10, 0, 0.9)
  return head

def create_centipede():
  head = create_default_segment(13)
  curr = head
  length = 10
  for i in range(length):
    x = create_default_segment(10)
    x['bodyAngle']['curveRange'] = 100
    x['wriggle'] = [to_squiggle_spec(10, 1, i, length*2)]
    x['overlap'] = 0
    add_leg(next, 1, 5, 80, i)
    add_leg(next, 1, 5, -80, i)
    curr['children'].append(x)
    curr = x
  return head

def create_horseshoe_crab():
  head = create_default_segment(40)
  body = create_default_segment(30)
  body['overlap'] = 30
  add_spike(body, 3, 5, 0)
  head['children'].append(body)
  return head

def create_crawdad():
  head = create_default_segment(30)
  curr = head
  for r in [22, 18, 15]:
    next = create_default_segment(r)
    next['overlap'] = r
    add_leg(next, 2, 5, 90, 0)
    add_leg(next, 2, 5, -90, 0)
    curr['children'].append(next)
    curr = next
  tail = create_default_segment(13)
  tail['overlap'] = 13
  leftTailScale = create_default_segment(15)
  rightTailScale['bodyAngle']['relative'] = 45
  leftTailScale['overlap'] = 15
  rightTailScale = create_default_segment(15)
  rightTailScale['bodyAngle']['relative'] = -45
  rightTailScale['overlap'] = 15
  curr['children'].append(leftTailScale)
  curr['children'].append(rightTailScale)
  return head

def create_newt():
  head = create_default_segment(20)
  add_tapered_snake(head, 10, 15, 0, 0.95, 0.5)
  curr = head
  curr = curr['children'][0]
  add_tapered_snake(curr, curr['radius'] / 2, 5, 45, 0.9, 0.5)
  add_tapered_snake(curr, curr['radius'] / 2, 5, -45, 0.9, 0.5)

  for i in range(2):
    curr = curr['children'][0]
  
  add_tapered_snake(curr, curr['radius'] / 2, 5, 45, 0.9, 0.5)
  add_tapered_snake(curr, curr['radius'] / 2, 5, -45, 0.9, 0.5)

  return head

def create_jelly():
  head = create_default_segment(40)
  frillCount = 3
  for i in range(2*frillCount+1):
    angle = 10 * (i-frillCount-1)
    add_frill(head, 2, 8, angle)
  for i in range(2*frillCount+1):
    angle = 5 * (i-frillCount-1)
    add_frill(head, 2, 8, angle)
  for i in range(2*frillCount+1):
    angle = 2 * (i-frillCount-1)
    add_frill(head, 2, 8, angle)
  return head

def create_octopus():
  head = create_default_segment(40)
  for i in range(6):
    angle = 8 + 16 * (i-3)
    add_octo_arm(head, 15, 12, angle, 0.90, 29 * i % 17)
  return head

def create_starfish():
  head = create_default_segment(20)
  for i in range(5):
    angle = 180 + 72 * i
    add_octo_arm(head, 15, 8, angle, 0.90, 0)
  return head

def create_axolotl():
  head = create_default_segment(20)
  add_tapered_snake(head, 10, 15, 0, 0.95, 0.5)
  curr = head
  curr = curr['children'][0]
  add_tapered_snake(curr, curr['radius'] / 2, 5, 45, 0.9, 0.5)
  add_tapered_snake(curr, curr['radius'] / 2, 5, -45, 0.9, 0.5)

  for i in range(2):
    curr = curr['children'][0]

  add_tapered_snake(curr, curr['radius'] / 2, 5, 45, 0.9, 0.5)
  add_tapered_snake(curr, curr['radius'] / 2, 5, -45, 0.9, 0.5)

  for i in range(6):
    angle = 30 + 60 * i
    add_octo_arm(head, 2, 5, angle, 0.9, 0)
  return head

def generate():
  return {
    'axolotl': create_axolotl()
  }

x = json.dumps(generate())
with open('./../client/public/pal.json', 'w') as f:
    f.write(x)

