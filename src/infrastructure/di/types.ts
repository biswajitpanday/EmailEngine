const TYPES = {
  EmailRepository: Symbol.for('EmailRepository'),
  EmailSyncService: Symbol.for('EmailSyncService'),
  EmailSyncController: Symbol.for('EmailSyncController'),
  OutlookService: Symbol.for('OutlookService'),
  ElasticsearchClient: Symbol.for('ElasticsearchClient'),
  ElasticsearchRepository: Symbol.for('ElasticsearchRepository'),
  UserRepository: Symbol.for('UserRepository'),
  AuthService: Symbol.for('AuthService'),
  AuthController: Symbol.for('AuthController'),
};

export { TYPES };
