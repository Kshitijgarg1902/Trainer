export type SetType = 'F' | 'W' | 'N';

export interface Set {
  reps: number;
  weight: number;
  type: SetType;
}

export interface newSet {
  reps: number;
  weight: number;
  type: SetType;
  checked: boolean;
  prevWeight: number | null;
}

export const typeColorMap: Record<SetType, string> = {
  F: 'text-red-500 border-red-400',
  W: 'text-yellow-500 border-yellow-400',
  N: 'text-blue-500 border-blue-400',
};
