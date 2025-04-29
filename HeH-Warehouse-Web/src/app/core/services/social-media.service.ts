import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {

  private socialMediaLinks: SocialMedia[] = [
    {
      url: "https://www.facebook.com/HeHConstructores/?locale=es_LA",
      icon: "fa-brands fa-facebook-f",
      title: 'Facebook'
    },
    {
      url: "https://www.youtube.com/@hidalgoehidalgos.a3165",
      icon: "fa-brands fa-youtube",
      title: 'YouTube'
    },
    {
      url: "https://x.com",
      icon: "fa-brands fa-x-twitter",
      title: 'Twitter'
    },
    {
      url: "https://www.heh.com.ec/",
      icon: "fa-solid fa-globe",      
      title: 'Website'
    }
  ];

  getSocialMediaLinks(): SocialMedia[] {
    return this.socialMediaLinks;
  }

}

export interface SocialMedia {
  url: string
  icon: string
  title: string
}