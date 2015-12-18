ServiceDataPublisher.configure([{
  service: 'buffer',
  translator: function(data){
    let services = {id: data.id}
    _.keys(data.services).map((service)=>{
      let service_data = data.services[service]
      services[service] = []
      service_data = _.isArray(service_data) ? service_data : [service_data]
      service_data.map((account_data)=>{
        services[service].push({
          id: account_data.service_id,
          avatar: account_data.avatar_https,
          username: account_data.service_username
        })
      })
    })
    return services
  }
},{
  service: 'facebook',
  translator: function(data){
    return {
      id: data.id,
      avatar: 'https://graph.facebook.com/'+data.id+'/picture?type=large',
      name: data.name,
      email: data.email
    }
  }
},{
  service: 'google',
  translator: function(data){
    return {
      id: data.id,
      avatar: data.picture,
      name: data.name,
      email: data.email
    }
  }
},{
  service: 'linkedin',
  translator: function(data){
    return {
      id: data.id,
      avatar: data.avatar_https,
      name: data.name,
      email: data.email
    }
  }
},{
  service: 'twitter',
  translator: function(data){
    return {
      id: data.id,
      avatar: data.profile_image_url_https,
      username: data.screenName
    }
  }
}])