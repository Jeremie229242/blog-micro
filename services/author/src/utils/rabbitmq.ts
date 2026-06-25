import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.Rabbimq_Host,
      port: 5672,
      username: process.env.Rabbimq_Username,
      password: process.env.Rabbimq_Password,
    });

    channel = await connection.createChannel();

    console.log("✅  Rabbitmq connecter");
  } catch (error) {
    console.error("❌ Erreur de connection a Rabbitmq", error);
  }
};

export const publishToQueue = async (queueName: string, message: any) => {
  if (!channel) {
    console.error(" Le canal Rabbitmq n'est pas initialisé.");
    return;
  }

  await channel.assertQueue(queueName, { durable: true });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};

export const invalidateChacheJob = async (cacheKeys: string[]) => {
  try {
    const message = {
      action: "invalidateCache",
      keys: cacheKeys,
    };

    await publishToQueue("invalidation du cache", message);

    console.log("✅ Tâche d'invalidation du cache publiée sur Rabbitmq");
  } catch (error) {
    console.error("❌ Échec de la publication du cache sur Rabbitmq", error);
  }
};