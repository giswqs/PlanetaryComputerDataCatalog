% Each `{toctree}` block will be rendered as a heading with specified by :caption
% Override a document's heading title with the syntax: Custom Title <path/to/file>
% You can add new toctree elements, or combine files from different directories under one.

```{toctree}
:maxdepth: 1
:caption: Overview

About <overview/about>
```

```{toctree}
:maxdepth: 1
:caption: Quickstarts

Reading from the STAC API <quickstarts/reading-stac>
quickstarts/reading-zarr-data
quickstarts/reading-tabular-data
quickstarts/scale-with-dask
```

```{toctree}
:maxdepth: 1
:caption: Tutorials

tutorials/landcover
```

```{toctree}
:maxdepth: 1
:caption: Concepts

concepts/data-catalog
concepts/computing
concepts/sas
```

```{toctree}
:maxdepth: 1
:caption: API Reference

STAC API <reference/stac>
Data Authentication API <reference/sas>
```