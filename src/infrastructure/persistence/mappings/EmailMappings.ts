const emailMappings = {
  mappings: {
    properties: {
      email: { type: 'text' },
      subject: { type: 'text' },
      sender: { type: 'text' },
      receivedDate: { type: 'date' },
    },
  },
};

export default emailMappings;
