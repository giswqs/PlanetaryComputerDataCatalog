import { useEffect, useState, useRef, useCallback } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";
import { Stack, StackItem, IStackTokens } from "@fluentui/react";

import SearchPane from "../components/viewer/SearchPane";
import ItemPanel from "../components/viewer/ItemPanel";
import { IStacItem, IStacSearchResult } from "../types/stac";

import {
  stacSearchDatasource,
  itemLineLayer,
  itemPolyLayer,
  itemHoverLayer,
  layerControl,
  getHighlightItemFn,
  getUnhighlightItemFn,
} from "../components/viewer/viewerLayers";

const mapContainerId: string = "viewer-map";

const Viewer = () => {
  const mapRef = useRef<atlas.Map | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<IStacSearchResult>();
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>();
  const [selectedItems, setSelectedItems] = useState<IStacItem[]>();

  const handleMapClick = useCallback((e: atlas.MapMouseEvent) => {
    if (e?.shapes?.length) {
      const shapes = e.shapes as atlas.Shape[];
      const ids = shapes.map(s => s.getId().toString());
      setSelectedItemIds(ids);
    }
  }, []);

  useEffect(() => {
    if (selectedItemIds) {
      const selected = searchResults?.features.filter(
        f => f.id && selectedItemIds.includes(f.id.toString())
      );
      setSelectedItems(selected);
    }
  }, [selectedItemIds, searchResults?.features]);

  useEffect(() => {
    const map = mapRef.current;

    if (mapReady && map) {
      map.sources.add(stacSearchDatasource);
      map.layers.add([itemPolyLayer, itemLineLayer, itemHoverLayer]);
      map.controls.add(layerControl, {
        position: atlas.ControlPosition.BottomRight,
      });
    }
  }, [mapReady]);

  useEffect(() => {
    const onReady = () => setMapReady(true);

    if (!mapRef.current) {
      const map = new atlas.Map(mapContainerId, {
        view: "Auto",
        center: [-80, 40],
        zoom: 2,
        language: "en-US",
        showFeedbackLink: false,
        showLogo: false,
        style: "grayscale_dark",
        renderWorldCopies: true,
        authOptions: {
          authType: atlas.AuthenticationType.subscriptionKey,
          subscriptionKey: process.env.REACT_APP_AZMAPS_KEY,
        },
      });

      map.events.add("ready", onReady);
      map.events.add("click", itemPolyLayer, handleMapClick);
      map.events.add("mousemove", itemPolyLayer, getHighlightItemFn(map));
      map.events.add("mouseleave", itemPolyLayer, getUnhighlightItemFn(map));

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Remove event handlers on unmount
    return () => map.events.remove("ready", onReady);
  }, [handleMapClick]);

  const handleResults = useCallback(
    (stacSearchResult: IStacSearchResult | undefined): void => {
      stacSearchDatasource.clear();
      if (stacSearchResult) {
        setSearchResults(stacSearchResult);
        setSelectedItems(undefined);
        setSelectedItemIds(undefined);
        stacSearchDatasource.add(stacSearchResult as atlas.data.FeatureCollection);
      }
    },
    []
  );

  const stackTokens: IStackTokens = {
    childrenGap: 5,
    padding: 10,
  };

  return (
    <>
      <h1>Experimental STAC Viewer</h1>
      <ItemPanel selectedItems={selectedItems} />
      <Stack horizontal tokens={stackTokens}>
        <StackItem grow={1} styles={{ root: { maxWidth: "33%", margin: 5 } }}>
          <SearchPane mapRef={mapRef} onResults={handleResults} />
        </StackItem>
        <StackItem grow={2}>
          <div id={mapContainerId} style={{ width: "100%", height: "50vh" }}></div>
        </StackItem>
      </Stack>
    </>
  );
};

export default Viewer;
