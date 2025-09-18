import MongoStore from 'connect-mongo';

export default function sessionConfig(mongoUri){
  const secret = process.env.SESSION_SECRET || 'devsecret';
  return {
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000*60*60*24, // 1 day
    },
    store: MongoStore.create({
      mongoUrl: mongoUri,
      collectionName: 'sessions'
    }),
  };
}
