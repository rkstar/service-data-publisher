import SDP from './service-data-publisher'

Meteor.startup(()=>{
  // create a new field on our user to store
  // sanitized external data...
  //
  // NOTE: we're using this "init" var to ensure that we
  // DO NOT update all of our users each time we start the server.
  // observe.added is run for each document found in the initial query.
  //
  // allow developers to override the default action by using Meteor.settings:
  // {
  //   "service-data-publisher": {"initializeOnStartup": true}
  // }
  // default is {"initializeOnStartup": false}
  const settings = Meteor.settings['service-data-publisher'] || null
  const override = settings ? settings.initializeOnStartup : false
  let initialQuery = !_.isNull(override) && !_.isUndefined(override) ? !override : true
  const cursor = Meteor.users.find()
  cursor.observe({
    added: function(doc){
      if( !initialQuery ){ SDP.updateServicesData(doc) }
    },
    changed: function(doc){
      if( !initialQuery ){ SDP.updateServicesData(doc) }
    }
  })
  initialQuery = false

  // add in support for rkstar:accounts-multiply
  if( Package['rkstar:accounts-multiply'] ){
    AccountsMultiply.onMultiply((owner, merged)=>{
      let modified_user = owner
      _.keys(owner.services).map((name)=>{
        let service = owner.services[name]
        service = !_.isArray(service) ? [service] : service
        service.map((account)=>{
          if( account.hasOwnProperty('email') ){
            modified_user = SDP.addServiceEmail(modified_user, account)
          }
        })
      })
      // update the services for this user
      SDP.updateServicesData(modified_user)
    }, true) // make this onMultiply a priority
  }
})

export const ServiceDataPublisher = 'service-data-publisher'