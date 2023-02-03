export interface IntercomCollection {
  id?:                            string;
  app_id?:                        string;
  name?:                          string;
  parent_id?:                     string;
  url_slug?:                      null;
  order?:                         number;
  description?:                   string;
  icon?:                          string;
  created_at?:                    string;
  count?:                         number;
  has_articles_requiring_review?: boolean;
  has_nonprecanned_articles?:     boolean;
  localized_content?:             LocalizedContent[];
  read_only?:                     boolean;
  site_provider?:                 null;
  external_icon_url?:             null;
}

export interface LocalizedContent {
  locale_id?:   string;
  name?:        string;
  description?: string;
}
export interface IntercomArticle { 
  title: string,
  description?: string,
  body?: string,
  author_id: string,
  state?: string,
  parent_id?: string,
  parent_type?: string,
  translated_content?: {}
}
