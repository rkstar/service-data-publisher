service-data-publisher
===============

This package automatically publishes a "safe" subset of the `user.services` collection for logged in users.
It is able to sanitize service data from `loginWith<ExternalService>()` calls for Twitter, Facebook, Google+, LinkedIn (see the [pauli:accounts-linkedin](https://github.com/PauliBuccini/meteor-accounts-linkedin) package), and Buffer (see my [rkstar:accounts-buffer](https://github.com/rkstar/accounts-buffer) package) by default.
This package now also allows you to configure it in any way you'd like and add services you use or create simply by passing a config object to `ServiceDataPublisher.configure()`

This allows you to have external services data available to your application without having to explicitly create and manage fields for each service you configure for your app.  It also takes care of sanitizing the services data so you don't accidentally pass access tokens and other potentially sensitive data to the client. 

## Installation
`meteor add rkstar:service-data-publisher`

## Usage
This package will automatically publish to `Meteor.user().services_data`.  You *DO NOT* need to subscribe to a publication.
The `Meteor.user().services_data` collection subset will include a key for each service that is available (mentioned above).
Each service will contain an array of connected accounts for that service (see [accounts-multiply](https://github.com/rkstar/accounts-multiply).
Each service account in that array will be an object with keys:
* id (service id)
* name / username (service username)
* email (if available)
* avatar (http:// url)

## Default services supported
* twitter
* facebook
* google+
* linkedin
* buffer

## Adding a Service
You can add any external service you would like to the `ServiceDataPublisher` and it will automatically start serving your external data via the `services_data` var in the `Meteor.user()` object!
You can add individual services like this:
```javascript
ServiceDataPublisher.addService('MyAwesomeNetwork',(data)=>{
  return {
    id: data.service_id,
    name: data.service_first_and_last_name,
    email: data.email_address,
    avatar: data.some_crazy_var_that_keeps_my_avatar_image_url_in_it,
    other_data: data.custom_fields_for_my_service_can_be_added_too
  }
})
```
... or you can pass an array of services to `ServiceDataPublisher.configure()` and do many at once!
```javascript
ServiceDataPublisher.configure([{
  service: 'MyAwesomeNetwork',
  translator: function(data){
  return {
    id: data.service_id,
    name: data.service_first_and_last_name,
    email: data.email_address,
    avatar: data.some_crazy_var_that_keeps_my_avatar_image_url_in_it,
    other_data: data.custom_fields_for_my_service_can_be_added_too
  }
},{
  ... etc...
}]
```

## Settings
By default, `ServiceDataPublisher` **will not** run updates on user accounts in its initial query that attaches `observe()` methods to the cursor.
  If you wish to override this default functionality, you can do so in `Meteor.settings`:
```javascript
// initializeOnStartup defaults to false
{
  "service-data-publisher": {
    "initializeOnStartup": true
  }
}
```


## Cool feature
Version 4.x was built to comply with the [accounts-multiply](https://github.com/rkstar/accounts-multiply) package.  *No configuration needed!*

**depcrepated**
*I will not be supporting [mikael:accounts-merge](https://github.com/lirbank/meteor-accounts-merge) beyond 3.x of this package*

This package automatically handles merges that happen with the awesome [mikael:accounts-merge](https://github.com/lirbank/meteor-accounts-merge) package.  *No configuration needed!*
