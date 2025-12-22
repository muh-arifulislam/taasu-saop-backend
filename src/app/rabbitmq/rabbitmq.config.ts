import { Channel, connect, Connection } from 'amqplib';
import config from '../config';

let rabbitConn: Connection | null = null;

export const getRabbitConnection = async (): Promise<Connection> => {
  if (!rabbitConn) {
    rabbitConn = await connect(config.rabbitmq as string);

    rabbitConn.on('close', () => {
      console.error('RabbitMQ closed — reconnecting...');
      rabbitConn = null;
      setTimeout(getRabbitConnection, 2000);
    });

    rabbitConn.on('error', (err) => console.error('RabbitMQ error:', err));
  }
  console.log('RabbitMQ connection established');
  return rabbitConn;
};

export const createChannel = async (): Promise<Channel> => {
  const conn = await getRabbitConnection();
  const channel = await conn.createChannel();
  return channel;
};
