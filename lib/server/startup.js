import SDP from './service-data-publisher'

Meteor.startup(()=>{
  // create a new field on our user to store
  // sanitized external data...
  Meteor.users.find().observe({
    added: function(doc){ SDP.updateServicesData(doc) },
    changed: function(doc){ SDP.updateServicesData(doc) }
  })

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