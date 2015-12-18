Meteor.publish('service-data-publisher-required-user-data', function(){
  var services_data = {
    'emails': 1,
    'profile': 1,
    'services_data': 1
  }
  return Meteor.users.find({_id: this.userId},{fields:services_data})
})