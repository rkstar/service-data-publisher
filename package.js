Package.describe({
  name: 'rkstar:service-data-publisher',
  version: '2.0.1',
  // Brief, one-line summary of the package.
  summary: 'Automatically sanitized and publish relevant data from external services when logged in.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/rkstar/service-data-publisher',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2')
  api.use('ecmascript', 'server')
  api.use('accounts-base', 'server')
  api.use('underscore', 'server')

  api.addFiles('subscription.js', 'client')
  api.addFiles([
    'publication.js',
    'service-data-publisher.js',
    'services-config.js',
    'startup.js'
    ], 'server')

  api.export('ServiceDataPublisher')
})