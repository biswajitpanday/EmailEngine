const TYPES = {
  ElasticsearchClient: Symbol.for('ElasticsearchClient'),
  ElasticsearchRepository: Symbol.for('ElasticsearchRepository'),
  UserRepository: Symbol.for('UserRepository'),
  EmailSyncRepository: Symbol.for('EmailSyncRepository'),
  EmailSyncService: Symbol.for('EmailSyncService'),
  AuthService: Symbol.for('AuthService'),
  OAuthService: Symbol.for('OAuthService'),
  AuthController: Symbol.for('AuthController'),
};

export { TYPES };
