const { DataTypes } = require('sequelize');
const db = require('../../config/db');
const { Proposals } = require('../proposals');

const ProposalAttachs = db.define('proposal_attachs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  proposal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Proposals,
      key: 'id'
    },
    validate: {
      notEmpty: { msg: "Proposal ID is required" },
      isInt: { msg: "Proposal ID must be an integer" }
    }
  },
  title: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  file_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  file_name: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  file_path: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mimetype: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: "MIME type is required" },
    },
  },
}, {
  freezeTableName: true,
  timestamps: true,
  paranoid: false,
  indexes: [
    { fields: ["proposal_id"] },
    { fields: ["proposal_id", "file_name"] },
  ],
});

// ✅ Definisikan relasi hanya jika `Proposals` telah didefinisikan
if (Proposals) {
  Proposals.hasMany(ProposalAttachs, {
    foreignKey: 'proposal_id',
    as: 'proposalAttachs',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  ProposalAttachs.belongsTo(Proposals, {
    foreignKey: {
      name: 'proposal_id',
      allowNull: false
    },
    as: 'proposal',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
}

module.exports = { ProposalAttachs };
