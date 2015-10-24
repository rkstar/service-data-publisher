ServiceDataPublisher.addSocialNetwork('google',(data)=>{
  return {
    id: data.id,
    avatar: data.picture,
    name: data.name,
    email: data.email
  }
})