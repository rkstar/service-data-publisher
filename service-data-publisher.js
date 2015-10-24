let instance = null
class __ServiceDataPublisher__ {
  constructor(opts=[]){
    instance = instance || this
    this.configure(opts)
    return instance
  }

  configure(opts=[]){
    if( _.isArray(opts) && (opts.length > 0) ){
      opts.map((config)=>{
        this.addSocialNetwork(config.service, config.translator)
      })
    }
  }

  addSocialNetwork(service, translator){
    if( !service || !_.isString(service) || !translator || !_.isFunction(translator) ){
      return
    }
    // subsequent add calls will overwrite previous translators
    this.social_networks[service] = translator
  }

  updateServicesData(user){
    let sanitized_data = this.sanitizeServicesData(user.services)
    Meteor.users.update({_id: user._id},{$set:{
      services_data: sanitized_data
    }})
  }

  sanitizeServicesData(services){
    let sanitized_data = {}
    _.keys(this.social_networks).map((service)=>{
      if( services[service] ){
        let translator = this.social_networks[service]
        sanitized_data[service] = translator(services[service])
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
      this.social_networks = {}
    }
    return this._social_networks
  }
  set social_networks(value){
    this._social_networks = (_.isObject(value)) ? value : {}
  }
}

ServiceDataPublisher = new __ServiceDataPublisher__()