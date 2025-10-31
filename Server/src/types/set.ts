export type setTemplate = {
  set_number: number;
  Type: setType;
};

enum setType {
  W = 'W',
  F = 'F',
  N = 'N',
}

export type set = {
  reps: number;
  weight: number;
  type: setType;
};
