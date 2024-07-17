const userMappings = {
  mappings: {
    properties: {
      id: { type: 'keyword' },
      name: { type: 'text' },
      email: { type: 'keyword' },
      isSynced: { type: 'text' },
      lastSyncToken: { type: 'keyword' },
      authToken: { type: 'text' },
      refreshToken: { type: 'text' },
    },
  },
};

export default userMappings;
