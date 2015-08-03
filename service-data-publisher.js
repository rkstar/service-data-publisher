Meteor.startup(function(){
  Accounts.onCreateUser(function(options, user){
    // create a new field on our user to store
    // sanitized external data...
    if( user.services ){
      user.services_data = ServiceDataPublisher.sanitizeServicesData(user.services)
    }
    if( options.profile ){
      user.profile = options.profile
    }
    return user
  })

  // update and sanitize services data when we log in
  Accounts.onLogin(function(data){
    ServiceDataPublisher.updateServicesData(data.user)
  })

  // check to see if we're using mikael:accounts-merge
  // if we are, we'll automagically add the email data we've
  // just merged into the emails field on this account!
  // this is some added sweetness for the developer. :)
  if( Package['mikael:accounts-merge'] ){
    AccountsMerge.onMerge = function( user, merged ){
      var modified_user = user
      _.keys(user.services).map(function(name){
        var service = user.services[name]
        if( service.hasOwnProperty('email') ){
          modified_user = ServiceDataPublisher.addServiceEmail(modified_user, service)
        }
      })

      // sanitize and add the services data to this user
      modified_user.services_data = ServiceDataPublisher.sanitizeServicesData(modified_user.services)
      Meteor.users.update({_id: user._id},{$set:modified_user})
    }
  }
})

var ServiceDataPublisher = {
  updateServicesData: function( user ){
    var services_data = this.sanitizeServicesData(user.services)
    Meteor.users.update({_id: user._id},{$set:{services_data:services_data}})
  },
  sanitizeServicesData: function( services ){
    var sanitized = {},
      social_networks = ['twitter','facebook','google','linkedin','buffer']
    social_networks.map(function(network){
      if( services[network] ){
        sanitized[network] = this.translateServiceData(network, services[network])
      }
    }, this)
    return sanitized
  },
  translateServiceData: function( network, data ){
    var translated = data
    switch( network ){
      case 'twitter':
        translated = this.translateTwitterServiceData(data)
        break
      case 'facebook':
        translated = this.translateFacebookServiceData(data)
        break
      case 'google':
        translated = this.translateGoogleServiceData(data)
      break
      case 'linkedin':
        translated = this.translateLinkedInServiceData(data)
        break
      case 'buffer':
        translated = this.translateBufferServiceData(data)
    }
    return translated
  },
  translateTwitterServiceData: function( data ){
    return {
      id: data.id,
      avatar: data.profile_image_url_https,
      username: data.screenName
    }
  },
  translateFacebookServiceData: function( data ){
    return {
      id: data.id,
      avatar: 'https://graph.facebook.com/'+data.id+'/picture?type=large',
      name: data.name,
      email: data.email
    }
  },
  translateGoogleServiceData: function( data ){
    return {
      id: data.id,
      avatar: data.picture,
      name: data.name,
      email: data.email
    }
  },
  translateLinkedInServiceData: function( data ){
    return {
      id: data.id,
      avatar: data.avatar_https,
      name: data.name,
      email: data.email
    }
  },
  translateBufferServiceData: function ( data ){
    var services = {id: data.id}
    _.keys(data.services).map(function(service){
      var service_data = data.services[service],
        account_data = {}
      services[service] = []
      service_data = (service_data instanceof Array) ? service_data : [service_data]
      service_data.map(function(account_data){
        services[service].push({
          id: account_data.service_id,
          avatar: account_data.avatar_https,
          username: account_data.service_username
        })
      }, this)
    }, this)

    return services
  },
  addServiceEmail: function( user, service, keys ){
    var addedEmailObject = {
      address: service.email,
      verified: (service.hasOwnProperty('verified_email')) ? service.verified_email : true
    }

    if( user.emails instanceof Array ){
      var hasServiceEmail = false
      user.emails.map(function(email){
        if( email.address == service.email ){
          hasServiceEmail = true
        }
      })
      if( !hasServiceEmail ){
        user.emails.push(addedEmailObject)
      }
    } else {
      user.emails = [addedEmailObject]
    }

    return user
  }
}