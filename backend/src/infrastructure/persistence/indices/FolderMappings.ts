const folderMappings = {
  mappings: {
    properties: {
      id: { type: 'keyword' },
      userId: { type: 'keyword' },
      provider: { type: 'keyword' },
      name: { type: 'text' },
      displayName: { type: 'text' },
      parentFolderId: { type: 'keyword' },
    },
  },
};

export default folderMappings;
