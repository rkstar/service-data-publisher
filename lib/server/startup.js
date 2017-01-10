import SDP from './service-data-publisher'
import moment from 'moment'

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
  let updating = false
  const cursor = Meteor.users.find()
  cursor.observe({
    added: function(doc){
      if( !initialQuery ){ SDP.updateServicesData(doc) }
    },
    changed: function(doc){
      const updateCushion = moment().subtract(10,'seconds').toDate()
      const lastUpdate = !_.isNull(doc.services_data_lastUpdate) && !_.isUndefined(doc.services_data_lastUpdate)
        ? doc.services_data_lastUpdate : new Date(0)
      if( !initialQuery && !updating && (updateCushion > lastUpdate)){
        updating = true
        SDP.updateServicesData(doc)
        updating = false
      }
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