let instance = null
class __ServiceDataPublisher__ {
  constructor(){
    instance = instance || this
    return instance
  }

  addSocialNetwork(name, translator){
    this.social_networks.push({name, translator})
  }

  updateServicesData(user){
    Meteor.users.update({_id: user._id},{$set:{
      services_data: this.sanitizeServicesData(user.servies)
    }})
  }

  sanitizeServicesData(services){
    let sanitized_data = {}
    this.social_networks.map((network)=>{
      if( services[network.name] ){
        sanitized_data[network.name] = network.translator(services[network.name])
      }
    })
    return sanitized_data
  }

  addServiceEmail(user, service){
    let addedEmailObject = {
      address: service.email,
      verified: (service.hasOwnProperty('verified_email')) ? service.verified_email : true
    }

    if( _.isArray(user.emails) ){
      let hasServiceEmail = false
      user.emails.map((email)=>{
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

  get social_networks(){
    if( !this._social_networks ){
      this.social_networks = []
    }
    return this._social_networks
  }
  set social_networks(value){
    if( !_.isArray(value) ){
      value = [value]
    }
    this._social_networks = value
  }
}

ServiceDataPublisher = new __ServiceDataPublisher__()