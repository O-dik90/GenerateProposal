const { DataTypes, Sequelize } = require('sequelize');
const db = require('../../config/db');
const { Users } = require('../users');

const Proposals = db.define('proposals', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Users,
      key: 'uuid'
    },
    validate: {
      notEmpty: { msg: "User ID wajib diisi" },
      isUUID: 4
    }
  },
  title: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: { msg: "Title cannot be empty" },
      len: { args: [3, 512], msg: "Judul minimal 3 dan maksimal 500 karakter" }
    }
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: { msg: "Description cannot be empty" },
      len: { args: [3, 512], msg: "Deskripsi minimal 3 dan maksimal 500 karakter" }
    }
  },
  year: {
    type: DataTypes.STRING(4),
    allowNull: false,
    validate: {
      notEmpty: { msg: "Tahun tidak boleh kosong" },
    }
  },
  pkm_type: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      notEmpty: { msg: "tipe PKM tidak boleh kosong" }
    }
  },
  pkm_category: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: { msg: "kategory PKM tidak boleh kosong" }
    }
  },
  pkm_desc: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  pkm_belmawa: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  pkm_perguruan: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  create_date: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  update_date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'create_date',
  updatedAt: 'update_date',
  paranoid: true,
  indexes: [
    { unique: true, fields: ['id'] },
    { fields: ['user_id'] }
  ]
});

// ** Ensure Associations Exist Before Using `hasMany` **
if (Users) {
  Users.hasMany(Proposals, {
    foreignKey: 'user_id',
    as: 'proposals',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Proposals.belongsTo(Users, {
    foreignKey: {
      name: 'user_id',
      allowNull: false
    },
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
}

module.exports = {Proposals};
