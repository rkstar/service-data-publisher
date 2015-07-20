Package.describe({
  name: 'rkstar:service-data-publisher',
  version: '1.0.0',
  // Brief, one-line summary of the package.
  summary: 'Automatically sanitized and publish relevant data from external services when logged in.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2')
  api.use('accounts-base', 'server')
  api.use('underscore', 'server')
  api.addFiles('service-data-publisher.js', 'server')
})