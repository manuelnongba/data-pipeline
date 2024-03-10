import type Item from './types/Item';

const ITEMS: Item[] = [
  {
    jobCode: '20-0601',
    poNumber: '103',
    orderDate: '2023-07-28T01:55:04.589Z',
    description: 'Eaton Type BA 3 pole 30A breaker',
    quantity: 5,
    unitPrice: 17.89,
    taxRate: 0.08,
  },
  {
    jobCode: '20-0601',
    poNumber: '103',
    orderDate: '2023-07-28T01:55:04.589Z',
    description: '[EMT] 3", 10\' Sticks',
    quantity: 10,
    unitPrice: 10.99,
    taxRate: 0.08,
  },
  {
    jobCode: '20-0601',
    poNumber: '103',
    orderDate: '2023-07-28T01:55:04.589Z',
    description:
      'Leviton 278-S00 30 Amp Flush Mount Receptacle, 125/250V, 14-30R',
    quantity: 10,
    unitPrice: 5.99,
    taxRate: 0.08,
  },
  {
    jobCode: '20-0601',
    poNumber: '104',
    orderDate: '2023-07-20T13:50:13.123Z',
    description: '60# Bag Concrete',
    quantity: 3,
    unitPrice: 8.49,
    taxRate: 0.08,
  },
  {
    jobCode: '20-0602',
    poNumber: '105',
    orderDate: '2023-07-19T11:45:10.869Z',
    description: '2 AWG THHN Stranded Copper, Green',
    quantity: 300,
    unitPrice: 11.49,
    taxRate: 0.065,
  },
  {
    jobCode: '20-0602',
    poNumber: '105',
    orderDate: '2023-07-19T11:45:10.869Z',
    description: '2 AWG THHN Stranded Copper, Red',
    quantity: 300,
    unitPrice: 11.49,
    taxRate: 0.065,
  },
  {
    jobCode: '20-0602',
    poNumber: '105',
    orderDate: '2023-07-19T11:45:10.869Z',
    description: '2 AWG THHN Stranded Copper, Black',
    quantity: 300,
    unitPrice: 11.49,
    taxRate: 0.065,
  },
];

const LINES_JSON = ITEMS.map((l) => JSON.stringify(l));

const DATA = Buffer.from(LINES_JSON.join('\n'));

export { LINES_JSON, DATA };
