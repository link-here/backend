import {Sequelize, Model, DataTypes} from 'sequelize';
import {DATA_DIR} from './config';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: `${DATA_DIR}/db.sqlite`
});

export class Link extends Model {
  public id!: number;
  public url!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Link.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  url: {
    type: new DataTypes.STRING(1000)
  }
}, {
  sequelize
});
