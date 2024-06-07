import { set, type Matrix2D } from '@figureland/mathkit/matrix2D'

export const round = (v: number) => Math.round(v * 1e3) / 1e3

export const roundMatrix = (m: Matrix2D) =>
  set(m, round(m[0]), round(m[1]), round(m[2]), round(m[3]), round(m[4]), round(m[5]))
