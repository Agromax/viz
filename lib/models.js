var Sequelize = require('sequelize');

var sequelize = new Sequelize('mysql://root:@localhost:3306/ask');


var User = sequelize.define('user', {
	firstName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	lastName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	userName: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	}
}, {
	freezeTableName: true
});	


sequelize.sync();

module.exports.User = User;