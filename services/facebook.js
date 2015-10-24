ServiceDataPublisher.addSocialNetwork('facebook',(data)=>{
  return {
    id: data.id,
    avatar: 'https://graph.facebook.com/'+data.id+'/picture?type=large',
    name: data.name,
    email: data.email
  }
})