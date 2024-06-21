const userMappings = {
  mappings: {
    properties: {
      email: { type: 'keyword' },
      password: { type: 'text' },
      outlookToken: { type: 'text' },
    },
  },
};

export default userMappings;
