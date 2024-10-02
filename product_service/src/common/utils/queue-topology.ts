import 'dotenv/config';
import { QueueTopologyInterface } from './interfaces';

export const queueTopology = (worker: string): QueueTopologyInterface => {
  const queue_prefix = process.env.RABBITMQ_QUEUE_PREFIX;
  const exchange = `${queue_prefix}.exchange`;
  let topology;
  switch (worker) {
    case 'test':
      topology = {
        queue: `${queue_prefix}.queue`,
        exchange,
        routing_key: `${queue_prefix}.route`,
      };
      break;
    case 'product':
      topology = {
        queue: `${queue_prefix}.product.service.queue`,
        exchange,
        routing_key: `${queue_prefix}.product.service.route`,
      };
      break;
    case 'owner':
      topology = {
        queue: `${queue_prefix}.owner.service.queue`,
        exchange,
        routing_key: `${queue_prefix}.owner.service.route`,
      };
      break;
    case 'order':
      topology = {
        queue: `${queue_prefix}.order.service.queue`,
        exchange,
        routing_key: `${queue_prefix}.order.service.route`,
      };
      break;
    default:
      throw new Error('Invalid queue: Something bad happened!');
  }

  return topology;
};

export const RETRY_EXCHANGE_NAME = 'retry.exchange';
