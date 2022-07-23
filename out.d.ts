/* Json Types */
export type CustomType = {
  demo: string;
};

/* models */
export type User = {
  id: string
}

export type Types = {
  id: string
  a?: string
  b: boolean
  c: number
  d: bigint
  e: number
  f: number
  g: Date
  h: CustomType
  i: Buffer
}

/* enums */
export const Test: {
  A: 'A',
  B: 'B',
};

export type Test = (typeof Test)[keyof typeof Test]