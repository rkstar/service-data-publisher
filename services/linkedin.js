ServiceDataPublisher.addSocialNetwork('linkedin',(data)=>{
  return {
    id: data.id,
    avatar: data.avatar_https,
    name: data.name,
    email: data.email
  }
})