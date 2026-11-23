#!/usr/bin/env python3
"""
Exports Philippine places to three CSV files for load_places.sql.

    pip install psgc
    python psgc_export.py            # writes regions.csv, provinces.csv, places.csv here

Source: the community-maintained `psgc` PyPI package (not affiliated with PSA; its
license field is empty, which is why the CSVs are generated on your machine instead
of being shipped). Names and codes are PSA's PSGC. The lat/lng are the package
author's derived centroids: fine for "is this within 30 km", not for navigation.

Anything that can produce the same three CSVs works too (for example the official
PSA PSGC Excel publication, https://psa.gov.ph/classification/psgc). The loader
does not care where the files come from. PSA publishes quarterly updates; re-run
this and the loader to refresh (the loader is idempotent).

What gets cleaned here:
  * The package wraps each independent city in a synthetic "province" whose code
    ends in 99999 (not an official code). Those are dropped: such cities get an
    empty province_code.
  * NCR, "City of Isabela (Not a Province)" and the Special Geographic Area are
    not real provinces either, so their cities also get an empty province_code.
  * Sub-municipalities (the 14 districts of the City of Manila) are skipped; users
    pick "City of Manila".
"""
import csv
import json
import os
import sys

import psgc

DATA_DIR = os.path.join(os.path.dirname(psgc.__file__), "data", "core")
OUT_DIR = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))


def load(name):
    with open(os.path.join(DATA_DIR, f"{name}.json"), encoding="utf-8") as f:
        return json.load(f)


regions = load("regions")
provinces = load("provinces")
cities = load("cities")

region_codes = {r["psgc_code"] for r in regions}


def is_real_province(p):
    return (
        not p["psgc_code"].endswith("99999")
        and p["psgc_code"] not in region_codes
        and "Not a Province" not in p["name"]
        and "Special Geographic" not in p["name"]
    )


real_provinces = [p for p in provinces if is_real_province(p)]
real_province_codes = {p["psgc_code"] for p in real_provinces}


def write(filename, header, rows):
    with open(os.path.join(OUT_DIR, filename), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)


write("regions.csv", ["psgc_code", "name", "island_group"],
      [(r["psgc_code"], r["name"], r.get("island_group") or "") for r in regions])

write("provinces.csv", ["psgc_code", "name", "region_code"],
      [(p["psgc_code"], p["name"], p["region_code"]) for p in real_provinces])

place_rows = []
for c in cities:
    if c["geographic_level"] == "SubMun":
        continue
    coord = c["coordinate"]
    place_rows.append((
        c["psgc_code"],
        c["name"],
        "city" if c["geographic_level"] == "City" else "municipality",
        c["region_code"],
        c["province_code"] if c["province_code"] in real_province_codes else "",
        coord["latitude"],
        coord["longitude"],
        c.get("population") if c.get("population") is not None else "",
    ))
write("places.csv",
      ["psgc_code", "name", "kind", "region_code", "province_code", "lat", "lng", "population"],
      place_rows)

print(f"PSGC data date {psgc.PSGC_DATA_DATE} (package {psgc.PSGC_VERSION})")
print(f"regions={len(regions)} provinces={len(real_provinces)} places={len(place_rows)}")
print(f"written to {OUT_DIR}")