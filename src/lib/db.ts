import {Sequelize, Model, DataTypes} from 'sequelize';
import {DATA_DIR, PRODUCTION} from './config';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: `${DATA_DIR}/db.sqlite`,
  logging: !PRODUCTION
});

export class Link extends Model {
  public id!: number;
  public url!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class AuthToken extends Model {
  public id!: number;
  public token!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Link.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  url: {
    type: new DataTypes.STRING(1000)
  }
}, {
  sequelize
});

AuthToken.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  token: {
    type: new DataTypes.STRING(32)
  }
}, {
  sequelize
});
