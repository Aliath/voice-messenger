const { MongoClient } = require('mongodb');

let database = null;
const handlersQueue = [];

(async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    database = client.db('voice-messenger');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
})();

const getDatabase = () => new Promise((resolve) => {
  if (database === null) {
    handlersQueue.push(resolve);
  } else {
    resolve(database);
  }
});

const users = new Map();

const updateOnlineUsers = () => {
  [...users.values()].forEach(client => {
    client.emit('update::onlineUsers', [...users.keys()]);
  });
};

const sendAllMessagesToUser = async (client) => {
  const db = await getDatabase();
  try {
    const result = await db.collection('messages').find().sort({ _id: 1 }).limit(50).toArray();
    client.emit('update::messages', [...result].map((({ message, ...data }) => ({
      message: message.buffer,
      ...data,
    }))));
  } catch (err) {
    console.log('getMessages error', err);
  }
};

const sendNewMessage = async (message) => {
  const db = await getDatabase();
  try {
    await db.collection('messages').insertOne(message)
  } catch (err) {
    console.log('getMessages error', err);
  }

  [...users.values()].forEach(client => {
    client.emit('update::messages', [message]);
  });
}

const socketController = (socketServer) => {
  try {
    socketServer.on('connection', (client) => {
      client.on('auth/request', (nickName) => {
        if (users.has(nickName)) {
          return;
        }

        client.emit('auth/request::ok');

        users.set(nickName, client);
        updateOnlineUsers();
        sendAllMessagesToUser(client);

        client.on('voiceMessage', (blob) => {
          const message = {
            sentAt: new Date().toJSON(),
            author: nickName,
            message: blob,
          };

          sendNewMessage(message)
        });

        client.on('disconnect', () => {
          users.delete(nickName);
          updateOnlineUsers();
        })
      });
    });
  } catch (error) {
    console.error('Socket error:', error);
  }
}

module.exports = socketController;