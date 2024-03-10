import alasql from 'alasql';

import { DataProcessor, Item, getUUID } from './lib';

class OrderProcessor extends DataProcessor {
  offset: number = 0;
  cachedData: Buffer = Buffer.from('');
  bufferedData: Buffer = Buffer.from('');
  accumulatedLine: string = '';

  existingJobcode: string = '';
  existingPoNumber: string = '';
  orderId: string = '';
  jobId: string = '';

  getLine(numBytes: number): string {
    // Check if there's no cached data. If so, fetch data from the data source
    if (this.cachedData.length === 0)
      this.cachedData = this.getData(this.offset, numBytes);

    if (!this.done && numBytes > 0) {
      // Set the bufferedData to the portion of cachedData using 'numBytes'
      this.bufferedData = this.cachedData.subarray(0, numBytes);
    } else throw new Error('Bytes should be larger than 0');

    if (this.cachedData.length > 0) {
      const newlineIndex: number = this.bufferedData.indexOf('\n');

      if (newlineIndex !== -1) {
        // Append the portion of bufferedData up to the newline to accumulatedLine
        this.accumulatedLine += this.bufferedData
          .subarray(0, newlineIndex)
          .toString();
        this.offset += newlineIndex + 1;
        // Update cachedData excluding the processed part
        this.cachedData = this.cachedData.subarray(newlineIndex + 1);

        const line = this.accumulatedLine;
        this.accumulatedLine = '';

        return line;
      }

      // If no newline character is found, append the entire bufferedData to accumulatedLine
      this.accumulatedLine += this.bufferedData.toString();
      this.offset += this.bufferedData.length;
      this.cachedData = this.cachedData.subarray(numBytes);

      return this.getLine(numBytes);
    } else {
      this.done = true;

      return this.accumulatedLine;
    }
  }

  saveItem(item: Item) {
    const ensureValidUUID = (uuid: string): string => {
      while (uuid.startsWith('0')) {
        uuid = getUUID();
      }
      return uuid;
    };

    const saveJob = (jobId: string, jobCode: string): void => {
      // Check if the job code has changed, then save the job to avoid duplicate jobs
      if (jobCode !== this.existingJobcode) {
        const sql = 'INSERT INTO jobs(id, code) VALUES (?, ?)';
        alasql(sql, [jobId, jobCode]);
        this.jobId = jobId;
        this.existingJobcode = jobCode;
      }
    };

    //save orders with the same job code by referencing Job with their respective jobId
    const saveOrder = (
      orderId: string,
      poNumber: string,
      orderDate: string,
      taxRate: number,
      jobId: string
    ): void => {
      // Check if the purchase order number has changed, then save the order to avoid duplicate orders
      if (poNumber !== this.existingPoNumber) {
        const sql =
          'INSERT INTO orders(id, po_number, order_date, tax_rate, job_id) VALUES (?, ?, ?, ?, ?)';
        alasql(sql, [orderId, poNumber, orderDate, taxRate, jobId]);
        this.orderId = orderId;
        this.existingPoNumber = poNumber;
      }
    };

    //save items with the same poNumber by referencing Order with their respective orderId
    const saveItems = (
      itemId: string,
      orderId: string,
      description: string,
      quantity: number,
      unitPrice: number
    ): void => {
      const sql =
        'INSERT INTO items(id, order_id, description, quantity, unit_price) VALUES (?, ?, ?, ?, ?)';
      alasql(sql, [itemId, orderId, description, quantity, unitPrice]);
    };

    const {
      jobCode,
      poNumber,
      orderDate,
      description,
      taxRate,
      quantity,
      unitPrice,
    } = item;
    const jobId: string = ensureValidUUID(getUUID());
    const orderId: string = ensureValidUUID(getUUID());
    const itemId: string = ensureValidUUID(getUUID());

    saveJob(jobId, jobCode);
    saveOrder(orderId, poNumber, orderDate, taxRate, this.jobId);
    saveItems(itemId, this.orderId, description, quantity, unitPrice);
  }
}

export default OrderProcessor;
