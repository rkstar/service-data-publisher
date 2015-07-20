service-data-publisher
===============

This package automatically publishes a "safe" subset of the `user.services` collection for logged in users.
It is able to sanitize service data from `loginWith<ExternalService>()` calls for Twitter, Facebook, Google+, LinkedIn (see the [pauli:accounts-linkedin](https://github.com/PauliBuccini/meteor-accounts-linkedin) package), and Buffer (see my [rkstar:accounts-buffer](https://github.com/rkstar/accounts-buffer) package)

This allows you to have external services data available to your application without having to explicitly create and manage fields for each service you configure for your app.  It also takes care of sanitizing the services data so you don't accidentally pass access tokens and other potentially sensitive data to the client. 

## Installation
`meteor add rkstar:service-data-publisher`

## Usage
This package will automatically publish to `Meteor.user().services_data`.  You *DO NOT* need to subscribe to a publication.
The `Meteor.user().services_data` collection subset will include a key for each service that is available (mentioned above).
Each service object will have:
* id (service id)
* name / username (service username)
* email (if available)
* avatar (http:// url)

## Cool feature
This package automatically handles merges that happen with the awesome [mikael:accounts-merge](https://github.com/lirbank/meteor-accounts-merge) package.  *No configuration needed!*