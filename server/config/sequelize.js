import Sequelize from 'sequelize';
import config from './env';

let instanceMssql = null;

function createSequelizeInstanceMSSQL () {

  return new Sequelize(config.databaseMssql.connection.database,
    config.databaseMssql.connection.user,
    config.databaseMssql.connection.password, {
      host: config.databaseMssql.connection.host,
      dialect: config.databaseMssql.client,
      port: config.databaseMssql.connection.port,
    });
}


const sequelize = {
  getInstanceMssql: () => {
    if (!instanceMssql) {
      console.log('create a new instance mssql'); // eslint-disable-line no-console
      instanceMssql = createSequelizeInstanceMSSQL();
    }
    return instanceMssql;
  },
};

export default sequelize;
