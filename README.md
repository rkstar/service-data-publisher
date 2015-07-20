service-data-publisher
===============

This package automatically publishes a "safe" subset of the `user.services` collection for logged in users.
It is able to sanitize service data from `loginWith<ExternalService>()` calls for Twitter, Facebook, Google+, LinkedIn (see the [pauli:accounts-linkedin](https://github.com/PauliBuccini/meteor-accounts-linkedin) package), and Buffer (see my [accounts-buffer](https://github.com/rkstar/accounts-buffer) package)

## Installation
`meteor add rkstar:service-data-publisher`

## Usage
This package will automatically publish to `Meteor.user().service_data`.  You *DO NOT* need to subscribe to a publication.

## Cool feature
This package automatically handles merges that happen with the awesome [mikael:accounts-merge](https://github.com/lirbank/meteor-accounts-merge) package.  CHECK IT OUT!