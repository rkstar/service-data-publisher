Meteor.startup(()=>{
  // create a new field on our user to store
  // sanitized external data...
  Meteor.users.find().observe({
    added: function(doc){ ServiceDataPublisher.updateServicesData(doc) },
    changed: function(doc){ ServiceDataPublisher.updateServicesData(doc) }
  })

  // check to see if we're using mikael:accounts-merge
  // if we are, we'll automagically add the email data we've
  // just merged into the emails field on this account!
  // this is some added sweetness for the developer. :)
  if( Package['rkstar:accounts-merge'] ){
    AccountsMerge.onMerge(function(user, mergedWith){
      var modified_user = user
      _.keys(user.services).map((name)=>{
        var service = user.services[name]
        if( service.hasOwnProperty('email') ){
          modified_user = ServiceDataPublisher.addServiceEmail(modified_user, service)
        }
      })
      // update the services for this user
      ServiceDataPublisher.updateServicesData(modified_user)
    }, true)
  }

  // add in support for rkstar:accounts-multiply
  if( Package['rkstar:accounts-multiply'] ){
    AccountsMultiply.onMultiply((owner, merged)=>{
      let modified_user = owner
      _.keys(owner.services).map((name)=>{
        let service = owner.services[name]
        service = !_.isArray(service) ? [service] : service
        service.map((account)=>{
          if( account.hasOwnProperty('email') ){
            modified_user = ServiceDataPublisher.addServiceEmail(modified_user, account)
          }
        })
      })
      // update the services for this user
      ServiceDataPublisher.updateServicesData(modified_user)
    }, true) // make this onMultiply a priority
  }
})