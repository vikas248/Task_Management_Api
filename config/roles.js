//Defined the roles accordingly
const roles = {
  admin: {
    can: ['addTask', 'updateTask', 'deleteTask', 'listTasks'],
  },
  user: {
    can: ['addTask', 'listTasks'],
  },
};

module.exports = roles;
