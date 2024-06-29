const emailMappings = {
  mappings: {
    properties: {
      userEmail: { type: 'keyword' },
      emailId: { type: 'keyword' },
      subject: { type: 'text' },
      body: { type: 'text' },
      from: { type: 'keyword' },
      to: { type: 'keyword' },
      receivedDateTime: { type: 'date' },
      createdDateTime: { type: 'date' },
      parentFolderId: { type: 'text' },
      originalFolderId: { type: 'text' },
      isRead: { type: 'boolean' },
      isFlagged: { type: 'boolean' },
      isDeleted: { type: 'boolean' },
      isMoved: { type: 'boolean' },
      isNew: { type: 'boolean' },
    },
  },
};

export default emailMappings;
