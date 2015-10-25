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
        this.addService(config.service, config.translator)
      })
    }
  }

  addService(service, translator){
    if( _.isString(service) && (service.length > 0) && _.isFunction(translator) ){
      this.services[service] = translator
    }
  }

  updateServicesData(user){
    let sanitized_data = this.sanitizeServicesData(user.services)
    Meteor.users.update({_id: user._id},{$set:{
      services_data: sanitized_data
    }})
  }

  sanitizeServicesData(services){
    let sanitized_data = {}
    _.keys(this.services).map((service)=>{
      if( services[service] ){
        let translator = this.services[service]
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

  get services(){
    if( !this._services ){
      this.services = []
    }
    return this._services
  }
  set services(value){
    if( !_.isArray(value) ){
      value = [value]
    }
    this._services = value
  }
}

ServiceDataPublisher = new __ServiceDataPublisher__()