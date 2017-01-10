Package.describe({
  name: 'rkstar:service-data-publisher',
  version: '4.1.3',
  // Brief, one-line summary of the package.
  summary: 'Automatically sanitized and publish relevant data from external services when logged in.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/rkstar/service-data-publisher',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom('1.3')
  api.use('ecmascript', 'server')
  api.use('accounts-base', 'server')
  api.use('underscore', 'server')
  api.use('modules')

  api.mainModule('lib/client/subscription.js', 'client')
  api.mainModule('lib/server/publication.js', 'server')
  api.mainModule('lib/server/service-data-publisher.js', 'server')
  api.mainModule('lib/server/service-data-publisher-config.js', 'server')
  api.mainModule('lib/server/startup.js', 'server')
})

Npm.depends({
  moment: "2.17.1"
})