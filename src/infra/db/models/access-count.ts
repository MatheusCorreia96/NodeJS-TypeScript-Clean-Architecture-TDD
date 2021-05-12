import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { AccessCount } from '@entities/access-count.entity';

export default class AccessCountModel {
  public count: number;
  
  public static createFromAttributeMap(map: AttributeMap) {
    const model = new this();
    model.count = +map.count.N;
    return model;
  }

  public static createFromEntity(entity: AccessCount): AccessCountModel {
    const model = new this();
    model.count = entity.count;
    return model;
  }

  public toEntity(): AccessCount {
    return AccessCount.build({
      count: this.count
    });
  }

  public toAttributeMap(): AttributeMap {
    return {
      count: {
        N: `${this.count}`
      }
    };
  }
}