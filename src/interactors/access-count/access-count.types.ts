import { AccessCount } from '@entities/access-count.entity';

export type PostAccessCountOutput = {
  count: number;
}

export type IncrementCountVisits = {
  value: number
}

export interface AccessCountGateway {
  incrementCount(): Promise<any>
}