export interface UserResponse {
   results: Result[];
   info: Info;
}

export interface Result {
   gender: string;
   name: Name;
   location: Location;
   email: string;
   login: Login;
   dob: Dob;
   registered: Registered;
   phone: string;
   cell: string;
   id: Id;
   picture: Picture;
   nat: string;
}

export interface Name {
   title: string;
   first: string;
   last: string;
}

export interface Location {
   street: Street;
   city: string;
   state: string;
   country: string;
   postcode: string;
   coordinates: Coordinates;
   timezone: Timezone;
}

export interface Street {
   number: number;
   name: string;
}

export interface Coordinates {
   latitude: string;
   longitude: string;
}

export interface Timezone {
   offset: string;
   description: string;
}

export interface Login {
   uuid: string;
   username: string;
   password: string;
   salt: string;
   md5: string;
   sha1: string;
   sha256: string;
}

export interface Dob {
   date: string;
   age: number;
}

export interface Registered {
   date: string;
   age: number;
}

export interface Id {
   name: string;
   value: string;
}

export interface Picture {
   large: string;
   medium: string;
   thumbnail: string;
}

export interface Info {
   seed: string;
   results: number;
   page: number;
   version: string;
}


export interface PhotosGetInfoResponse {
   photo: Photo;
   stat: string;
}

export interface Photo {
   id: string;
   secret: string;
   server: string;
   farm: number;
   dateuploaded: string;
   isfavorite: number;
   license: string;
   safety_level: string;
   rotation: number;
   originalsecret: string;
   originalformat: string;
   owner: Owner;
   title: Title;
   description: Description;
   visibility: Visibility;
   dates: Dates;
   views: string;
   editability: Editability;
   publiceditability: Publiceditability;
   usage: Usage;
   comments: Comments;
   notes: Notes;
   people: People;
   tags: Tags;
   urls: Urls;
   media: string;
}

export interface Owner {
   nsid: string;
   username: string;
   realname: string;
   location: string;
   iconserver: string;
   iconfarm: number;
   path_alias: any;
   gift: Gift;
}

export interface Gift {
   gift_eligible: boolean;
   eligible_durations: string[];
   new_flow: boolean;
}

export interface Title {
   _content: string;
}

export interface Description {
   _content: string;
}

export interface Visibility {
   ispublic: number;
   isfriend: number;
   isfamily: number;
}

export interface Dates {
   posted: string;
   taken: string;
   takengranularity: number;
   takenunknown: string;
   lastupdate: string;
}

export interface Editability {
   cancomment: number;
   canaddmeta: number;
}

export interface Publiceditability {
   cancomment: number;
   canaddmeta: number;
}

export interface Usage {
   candownload: number;
   canblog: number;
   canprint: number;
   canshare: number;
}

export interface Comments {
   _content: string;
}

export interface Notes {
   note: any[];
}

export interface People {
   haspeople: number;
}

export interface Tags {
   tag: Tag[];
}

export interface Tag {
   id: string;
   author: string;
   authorname: string;
   raw: string;
   _content: string;
   machine_tag: number;
}

export interface Urls {
   url: Url[];
}

export interface Url {
   type: string;
   _content: string;
}

// ----------------------------------- //

export interface PhotosGetRecentResponse {
   photos: Photos;
   stat: string;
}

export interface Photos {
   page: number;
   pages: number;
   perpage: number;
   total: number;
   photo: PhotosGetRecentPhoto [];
}

export interface PhotosGetRecentPhoto {
   id: string;
   owner: string;
   secret: string;
   server: string;
   farm: number;
   title: string;
   ispublic: number;
   isfriend: number;
   isfamily: number;
}

// ----------------------------------- //

export interface GetPhotoTagsResponse {
   photo: TagPhoto;
   stat: string;
}

export interface TagPhoto {
   id: string;
   tags: PhotoTags;
}

export interface PhotoTags {
   tag: PhotoTag[];
}

export interface PhotoTag {
   id: string;
   author: string;
   authorname: string;
   raw: string;
   _content: string;
   machine_tag: number;
}

// ----------------------------------- //

export interface GetUserInfoResponse {
   person: Person;
   stat: string;
}

export interface Person {
   id: string;
   nsid: string;
   ispro: number;
   is_deleted: number;
   iconserver: string;
   iconfarm: number;
   path_alias: string;
   has_stats: number;
   pro_badge: string;
   expire: string;
   username: Username;
   realname: Realname;
   location: Location;
   timezone: Timezone;
   description: Description;
   photosurl: Photosurl;
   profileurl: Profileurl;
   mobileurl: Mobileurl;
   photos: UserPhotos;
   has_adfree: number;
   has_free_standard_shipping: number;
   has_free_educational_resources: number;
}

export interface Username {
   _content: string;
}

export interface Realname {
   _content: string;
}

export interface Location {
   _content: string;
}

export interface Timezone {
   label: string;
   offset: string;
   timezone_id: string;
   timezone: number;
}

export interface Description {
   _content: string;
}

export interface Photosurl {
   _content: string;
}

export interface Profileurl {
   _content: string;
}

export interface Mobileurl {
   _content: string;
}

export interface UserPhotos {
   firstdatetaken: Firstdatetaken;
   firstdate: Firstdate;
   count: Count;
}

export interface Firstdatetaken {
   _content: string;
}

export interface Firstdate {
   _content: string;
}

export interface Count {
   _content: number;
}
