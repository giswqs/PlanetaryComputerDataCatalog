import { Feature, FeatureCollection } from "geojson";

export interface IStacCollection {
  id: string;
  title: string;
  description: string;
  license: string;
  extent: {
    spatial: {
      bbox: Array<Array<number>>;
    };
    temporal: {
      interval: Array<Array<string>>;
    };
  };
  keywords: string[];
}

export interface IStacItem extends Feature {
  collection: string;
  assets: {};
}

export interface IStacSearch {
  collections: string[];
  bbox: [number, number, number, number];
  limit: number;
  datetime: string;
  items?: string[];
}

export interface IStacSearchResult extends FeatureCollection {
  features: IStacItem[];
  numberMatched: number;
  numberReturned: number;
  context: {
    limit: number;
    matched: number;
    returned: number;
  };
}
