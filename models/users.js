module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    
    name: {
      type: DataTypes.STRING,
    }, 
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    treats: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true
    },
    shedding: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    energy: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    trainability : {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    kid: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    groom: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    drool: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    bark: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    independence: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    weight: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
  });

  return User;
};
