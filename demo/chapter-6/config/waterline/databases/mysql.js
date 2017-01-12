module.exports = {
  host: process.env.FORIM_MYSQL_DB_HOST || '127.0.0.1',
  user: process.env.FORIM_MYSQL_DB_USER || 'vig',
  password: process.env.FORIM_MYSQL_DB_PASSWORD || 'vig',
  database: process.env.FORIM_MYSQL_DB_NAME || 'vig',
  prefix: process.env.FORIM_MYSQL_DB_PREFIX || ''
};
