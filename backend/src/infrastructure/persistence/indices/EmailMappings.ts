const emailMappings = {
  mappings: {
    properties: {
      id: { type: 'keyword' },
      userId: { type: 'keyword' },
      createdDateTime: { type: 'date' },
      lastModifiedDateTime: { type: 'date' },
      receivedDateTime: { type: 'date' },
      sentDateTime: { type: 'date' },
      subject: { type: 'text' },
      from: {
        properties: {
          name: { type: 'text' },
          email: { type: 'keyword' },
        },
      },
      to: {
        type: 'nested',
        properties: {
          name: { type: 'text' },
          email: { type: 'keyword' },
        },
      },
      cc: {
        type: 'nested',
        properties: {
          name: { type: 'text' },
          email: { type: 'keyword' },
        },
      },
      bcc: {
        type: 'nested',
        properties: {
          name: { type: 'text' },
          email: { type: 'keyword' },
        },
      },
      replyTo: {
        type: 'nested',
        properties: {
          name: { type: 'text' },
          email: { type: 'keyword' },
        },
      },
      body: { type: 'text' },
      attachments: {
        type: 'nested',
        properties: {
          filename: { type: 'text' },
          url: { type: 'keyword' },
          type: { type: 'keyword' },
        },
      },
      isRead: { type: 'boolean' },
      isFlagged: { type: 'boolean' },
      categories: { type: 'keyword' },
      importance: { type: 'keyword' },
      parentFolderId: { type: 'keyword' },
      conversationId: { type: 'keyword' },
      conversationIndex: { type: 'keyword' },
      internetMessageId: { type: 'keyword' },
      isDeliveryReceiptRequested: { type: 'boolean' },
      isReadReceiptRequested: { type: 'boolean' },
      isDraft: { type: 'boolean' },
      webLink: { type: 'keyword' },
      inferenceClassification: { type: 'keyword' },
      changeKey: { type: 'keyword' },
      flag: {
        properties: {
          flagStatus: { type: 'keyword' },
        },
      },
      provider: { type: 'keyword' },
      etag: { type: 'keyword' },
    },
  },
};

export default emailMappings;
