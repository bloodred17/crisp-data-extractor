import axios, { AxiosRequestConfig } from "axios"
import { CrispArticle } from "./crisp.interface"
import { IntercomArticle } from "./intercom.interface"

const crispToIntercomMapping: Record<string, string> = {
  '1103323f-7f84-45db-99b0-40b984db04a1': '3171344',
  '8ccb1a7e-050c-4575-bb1e-d15e9b98235d': '3172769',
  'bc5c9e3a-1c98-4fff-ad43-2f221984adbb': '3173122',
  'cfd9bf19-8a28-4c0a-bb41-3ef8707c113b': '3173187',
  'f4911e20-9f74-4c05-8267-5496fb1b7b5d': '3174674',
  '5215b223-2b6f-45b4-b90a-924d4761d046': '3175672',
  '18dfe3da-98ee-4225-a8f4-401e9464f541': '3175713',
  '3d1c0084-94b8-4d5f-aad2-52e82ae2568d': '3175940',
  '645200f9-a91a-42a9-8eb5-27679d05131c': '3175985',
}

export async function intercomMigrate(crispArticle: CrispArticle) {
  const intercomArticle: IntercomArticle = {
    title: crispArticle?.title as string,
    description: crispArticle?.description || crispArticle?.title,
    body: crispArticle?.html,
    author_id: '5211772',
    parent_id: crispArticle?.category.category_id ? crispToIntercomMapping[crispArticle?.category.category_id] : 'home',
    parent_type: 'collection',
    state: crispArticle?.status
  }
  const config: AxiosRequestConfig = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer dG9rOmI4NzkxNjEyXzUyNzJfNGZkZV9hM2EzX2ZhNWI3ZGMzMmZiMDoxOjA='
    },
    url: 'https://api.intercom.io/articles',
    data: intercomArticle
  }
  const response = axios.request(config)
  console.log(response)
}
