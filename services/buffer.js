ServiceDataPublisher.addSocialNetwork('buffer',(data)=>{
  let services = {id: data.id}
  _.keys(data.services).map((service)=>{
    let service_data = data.services[service]
    services[service] = []
    service_data = (_.isArray(service_data)) ? service_data : [service_data]
    service_data.map((account_data)=>{
      services[service].push({
        id: account_data.service_id,
        avatar: account_data.avatar_https,
        username: account_data.service_username
      })
    })
  })
  return services
})