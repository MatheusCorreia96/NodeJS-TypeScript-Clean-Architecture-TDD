export interface AccessCountProps {
  count: number
}

export class AccessCount {
  private _count: number;

  public static build(obj: AccessCountProps): AccessCount {
    const accessCount = new this();

    accessCount.count = obj.count;

    return accessCount
  }

  set count(count: number) {
    if(!count || typeof count !== 'number'){
      throw new Error('Invalid count');
    }

    this._count = count;
  }

  get count() {
    return this._count;
  }
}