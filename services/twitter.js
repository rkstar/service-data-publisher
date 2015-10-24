ServiceDataPublisher.addSocialNetwork('twitter',(data)=>{
  return {
    id: data.id,
    avatar: data.profile_image_url_https,
    username: data.screenName
  }
})