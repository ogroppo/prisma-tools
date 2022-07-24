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
  a: string | null
  b: boolean
  c: number
  d: bigint
  e: number
  f: number
  g: Date
  h: any
  i: Buffer
}

export type TypesWithU = {
  id: string
  a: string | null
  b: boolean
  c: number
  d: bigint
  e: number
  f: number
  g: Date
  h: any
  i: Buffer
  u: User
}

export type TypesWithUu = {
  id: string
  a: string | null
  b: boolean
  c: number
  d: bigint
  e: number
  f: number
  g: Date
  h: any
  i: Buffer
  uu: User
}

export type TypesWithUuu = {
  id: string
  a: string | null
  b: boolean
  c: number
  d: bigint
  e: number
  f: number
  g: Date
  h: any
  i: Buffer
  uuu: User
}

export type TypesWithUAndUu = {
  id: string
  a: string | null
  b: boolean
  c: number
  d: bigint
  e: number
  f: number
  g: Date
  h: any
  i: Buffer
  u: User
  uu: User
}

export type TypesWithUAndUuu = {
  id: string
  a: string | null
  b: boolean
  c: number
  d: bigint
  e: number
  f: number
  g: Date
  h: any
  i: Buffer
  u: User
  uuu: User
}

export type TypesWithUuAndUuu = {
  id: string
  a: string | null
  b: boolean
  c: number
  d: bigint
  e: number
  f: number
  g: Date
  h: any
  i: Buffer
  uu: User
  uuu: User
}

export type TypesWithUAndUuAndUuu = {
  id: string
  a: string | null
  b: boolean
  c: number
  d: bigint
  e: number
  f: number
  g: Date
  h: any
  i: Buffer
  u: User
  uu: User
  uuu: User
}

/* enums */
export const Test: {
  A: 'A',
  B: 'B',
};

export type Test = (typeof Test)[keyof typeof Test]