Meteor.startup(()=>{
  let updateServicesData = function(doc){
    Meteor.users.update({_id: doc._id},{$set:{
      services_data: ServiceDataPublisher.sanitizeServicesData(doc.services)
    }})
  }

  // create a new field on our user to store
  // sanitized external data...
  Meteor.users.find().observe({
    added: updateServicesData,
    changed: updateServicesData
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
    AccountsMerge.onMerge = function(user, mergedWith){
      var modified_user = user
      _.keys(user.services).map(function(name){
        var service = user.services[name]
        if( service.hasOwnProperty('email') ){
          modified_user = ServiceDataPublisher.addServiceEmail(modified_user, service)
        }
      })

      // sanitize and add the services data to this user
      modified_user.services_data = ServiceDataPublisher.sanitizeServicesData(modified_user.services)
      Meteor.users.update({_id: user._id},{$set: modified_user})
    }
  }
})