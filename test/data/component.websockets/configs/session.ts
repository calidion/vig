import * as session from "express-session";

const MemoryStore = session.MemoryStore;

const store = new MemoryStore();
const options = {
  store: store,
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
};

export =  {
  store: store,
  options: options,
  middleware: session(options)
};
