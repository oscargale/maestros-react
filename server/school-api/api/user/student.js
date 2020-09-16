import Sequelize, { DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize';

const Student = sequelize.getInstanceMssql().define('MAE_USUARIOS', {
  id_usuario: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  usuario: Sequelize.STRING,
  password: Sequelize.STRING,
  id_personal: Sequelize.INTEGER,
  nombre_completo: Sequelize.STRING,
}, {
  timestamps: false,
  freezeTableName: true,
});

export default Student;
