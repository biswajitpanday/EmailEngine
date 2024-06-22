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
    },
  },
};

export default emailMappings;
