import { createChannel } from './rabbitmq.config';

const QUEUE_NAME = 'order-notifications';

export const publishOrderNotification = async (payload: object) => {
  const channel = await createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  // eslint-disable-next-line no-undef
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });
};
