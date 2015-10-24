Meteor.startup(()=>{
  // create a new field on our user to store
  // sanitized external data...
  Meteor.users.find().observe({
    added: function(doc){ ServiceDataPublisher.updateServicesData(doc) },
    changed: function(doc){ ServiceDataPublisher.updateServicesData(doc) }
  })

  // update and sanitize services data when we log in
  Accounts.onLogin((data)=>{
    ServiceDataPublisher.updateServicesData(data.user)
  })

  // check to see if we're using mikael:accounts-merge
  // if we are, we'll automagically add the email data we've
  // just merged into the emails field on this account!
  // this is some added sweetness for the developer. :)
  if( Package['mikael:accounts-merge'] ){
    AccountsMerge.onMerge = function(user, mergedWith){
      var modified_user = user
      _.keys(user.services).map((name)=>{
        var service = user.services[name]
        if( service.hasOwnProperty('email') ){
          modified_user = ServiceDataPublisher.addServiceEmail(modified_user, service)
        }
      })
      // update the services for this user
      ServiceDataPublisher.updateServicesData(modified_user)
    }
  }
})