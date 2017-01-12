module.exports = {
  connection: 'default',  // 指定连接配置
  identity: 'user',       // 指定的唯一标识
  schema: true,          
  tableName: 'user',      // 指定的表名
  attributes: {
    username: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    }
  }
};
