Meteor.publish(null, function(){
  var services_data = {
    'emails': 1,
    'profile': 1,
    'services_data': 1
  }
  return Meteor.users.find({_id: this.userId},{fields:services_data})
})

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
  if( AccountsMerge !== 'undefined' ){
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
      social_networks = ['twitter','facebook','google','linkedin']
    social_networks.map(function(network){
      if( services[network] ){
        sanitized[network] = this.translateServiceData(network, services[network])
      }
    }, this)
    // buffer is a special case...
    if( services.buffer ){
      sanitized.buffer = this.translateBufferServiceData(services.buffer)
      if( sanitized.facebook && sanitized.buffer.facebook ){
        sanitized.facebook.avatar = sanitized.buffer.facebook.avatar
      }
      // clean up the buffer object
      social_networks.map(function( network ){
        if( sanitized.buffer[network] ){
          if( !sanitized[network] ){
            sanitized[network] = _.clone(sanitized.buffer[network])
          }
          delete sanitized.buffer[network]
        }
      }, this)
    }

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
        translated = this.translateLinkedInServicesData(data)
        break
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
  translateLinkedInServicesData: function( data ){
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
      var service_data = data.services[service]
      var defaults = {
        id: service_data.service_id,
        avatar: service_data.avatar_https
      }
      switch( service ){
        case 'twitter':
          services.twitter = _.defaults({
            username: service_data.service_username
          }, defaults)
          break
        case 'facebook':
        case 'google':
        case 'linkedin':
          services[service] = _.defaults({
            name: service_data.service_username
          }, defaults)
          break
      }
    })
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