const { DataTypes } = require('sequelize');
const db = require('../../config/db');
const { Proposals } = require('../proposals');

const ProposalDetails = db.define('proposal_details', {
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
  bab_title: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  subbab_title: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  subbab_value: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  json_data: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  }
}, {
  freezeTableName: true,
  timestamps: true,
  paranoid: false,
  indexes: [
    { fields: ['proposal_id'] } // ✅ Index yang benar
  ]
});

if (ProposalDetails) {
  Proposals.hasMany(ProposalDetails, {
    foreignKey: 'proposal_id',
    as: 'proposalDetails',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  ProposalDetails.belongsTo(Proposals, {
    foreignKey: 'proposal_id',
    as: 'proposal',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
}

module.exports = { ProposalDetails };
