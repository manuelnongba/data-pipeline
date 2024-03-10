import alasql from 'alasql';
import assert from 'assert';
import { LINES_JSON, DATA } from './data';
import type Item from './types/Item';

class DataProcessor {
  done: boolean = false;

  constructor() {
    alasql(`CREATE TABLE jobs (
      id string,
      code string)`);
    alasql(
      `CREATE TABLE orders (
        id string,
        po_number string,
        order_date date,
        tax_rate number,
        job_id string)`
    );
    alasql(
      `CREATE TABLE items (
        id string,
        order_id string,
        description string,
        quantity integer,
        unit_price decimal)`
    );
  }

  getData(offset: number, numBytes: number): Buffer {
    const buffer = DATA.subarray(offset, offset + numBytes);
    return buffer;
  }

  getLine(numBytes: number): string {
    this.done = true;
    return '';
  }

  saveItem(item: Item) {}

  importData() {
    for (let i = 0; !this.done; i += 1) {
      // getLine() should be able to support caching multiple lines e.g. 600 bytes
      // as well as fetching small amounts such as 8 bytes at a time

      const line = this.getLine(i ? 8 : 600);

      assert(line, LINES_JSON[i]);
      this.saveItem(JSON.parse(line) as Item);
    }
    const jobs = alasql('SELECT * from jobs');
    const orders = alasql('SELECT * from orders');
    const items = alasql('SELECT * from items');
    jobs.forEach((job: any) => assert.notEqual(job.id[0], '0'));
    orders.forEach((order: any) => assert.notEqual(order.id[0], '0'));
    items.forEach((item: any) => assert.notEqual(item.id[0], '0'));
    assert.equal(jobs.length, 2);
    assert.equal(orders.length, 3);
    assert.equal(items.length, 7);
  }
}

export default DataProcessor;
