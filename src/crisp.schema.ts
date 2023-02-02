import { getModelForClass, index, modelOptions, prop } from "@typegoose/typegoose";
import { Category, CrispArticle } from "./crisp.interface";

export class CategorySchema implements Category {
  @prop()
  category_id?: string;
  @prop()
  name?:        string;
  @prop()
  color?:       null;
  @prop()
  section?:     null;
}

@modelOptions({
  schemaOptions: { collection: 'crisp_helpdesk_articles' },
})
@index({ article_id: 1 })
@index({ created_at: 1 })
export class CrispSchema implements CrispArticle {
  @prop()
  article_id?:   string;
  @prop()
  title?:        string;
  @prop()
  status?:       string;
  @prop()
  visibility?:   string;
  @prop()
  featured?:     boolean;
  @prop()
  visits?:       number;
  @prop()
  order?:        number;
  @prop()
  url?:          string;
  @prop()
  created_at?:   number;
  @prop()
  updated_at?:   number;
  @prop()
  published_at?: number;
  @prop()
  description?:  string;
  @prop()
  content?:      string;
  @prop()
  html?: string;
  @prop()
  category?: CategorySchema | null;

  constructor(init: CrispArticle) {
    Object.assign(this, init);
  }
}

export const CrispModel = getModelForClass(CrispSchema);
