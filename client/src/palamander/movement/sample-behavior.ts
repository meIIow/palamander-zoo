import { SampleSpec } from './movement-sample';

type SampleBehavior = {
  speed: SampleSpec;
  turn: SampleSpec;
  interval: SampleSpec;
}

type SampleInput = {
  id: string;
  magnitude: number;
}

// A map from a sampling behavior ID to its corresponding spec generator.
interface SampleMap {
  [key: string]: (magnitude: number) => SampleSpec;
}

function generatePlacerholderSpeedSampleSpec(_magnitude: number): SampleSpec {
  return {
    range: {
      min: 0,
      max: 100,
      skewMin: 2,
    },
    zero: 0.15,
    mirror: false,
  };
}

function generatePlacerholderTurnSampleSpec(_magnitude: number): SampleSpec {
  return {
    range: {
      min: 0,
      max: 100,
      skewMin: 2,
    },
    zero: 0.15,
    mirror: true,
  };
}

function generatePlacerholderIntervalSampleSpec(_magnitude: number): SampleSpec {
  return {
    range: {
      min: 200,
      max: 5000,
      skewMin: 3,
    },
    zero: 0,
    mirror: false,
  };
}

/*
gradients 0-100
distractible vs focused (interval)
squirrely vs mellow (turn)
zoomy vs lazy (speed)
floaty vs zippy (acceleration)
*/

const speedMap: SampleMap = {
  'placeholder': generatePlacerholderSpeedSampleSpec,
};

const turnMap: SampleMap = {
  'placeholder': generatePlacerholderTurnSampleSpec,
};

const intervalMap: SampleMap = {
  'placeholder': generatePlacerholderIntervalSampleSpec,
};

function accessSampleMap(map: SampleMap, input: SampleInput): SampleSpec {
  if (input.id in map) {
    return map[input.id](input.magnitude);
  }
  console.log(`${input.id} not present in sample map, falling back to placeholder.`);
  return map['placeholder'](input.magnitude);
}

function getSampleBehavior(speed: SampleInput, turn: SampleInput, interval: SampleInput) {
  return {
    speed: accessSampleMap(speedMap, speed),
    turn: accessSampleMap(turnMap, turn),
    interval: accessSampleMap(intervalMap, interval),
  }
}


export type { SampleBehavior };
export { getSampleBehavior };