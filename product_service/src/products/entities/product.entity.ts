import * as moment from 'moment-timezone';

export class Product {
  createdAt: Date | string;
  lastModifiedAt: Date | string;

  constructor(createdAt: Date | string, lastModifiedAt: Date | string) {
    this.createdAt = createdAt;
    this.lastModifiedAt = lastModifiedAt;
  }

  // Don't remove this
  get _createdAt(): string | Date {
    if (moment(this.createdAt).isValid()) {
      return moment(this.createdAt).format('YYYY-MM-DDTHH:mm:sssZ');
    }
    return this.createdAt;
  }

  // Don't remove this
  get _lastModifiedAt(): string | Date {
    if (moment(this.lastModifiedAt).isValid()) {
      return moment(this.lastModifiedAt).format('YYYY-MM-DDTHH:mm:sssZ');
    }
    return this.lastModifiedAt;
  }
}
