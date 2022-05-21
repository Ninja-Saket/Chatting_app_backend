"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Users", [
      {
        firstName: "Saket",
        lastName: "Ray",
        email: "abc1@gmail.com",
        password: "secret",
        gender: "male",
      },
      {
        firstName: "Deepak",
        lastName: "Kumar",
        email: "abc2@gmail.com",
        password: "secret",
        gender: "male",
      },
      {
        firstName: "Sristi",
        lastName: "Kumari",
        email: "abc3@gmail.com",
        password: "secret",
        gender: "female",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};
