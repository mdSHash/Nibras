import * as turf from "@turf/turf";

export interface TerritoryPolygon {
  name: string;
  color: string;
  coordinates: [number, number][][]; // Leaflet format: [lat, lng]
}

export interface TerritoryGroup {
  id: string;
  name: string;
  color: string;
  polygons: TerritoryPolygon[];
  features?: any[];
  isEmpire?: boolean;
  specificName?: string;
}

// Global colors
const C_BYZ = "#8b5cf6"; // Purple
const C_SAS = "#f97316"; // Orange
const C_ISLAM = "#10b981"; // Emerald Green
const C_REBEL = "#dc2626"; // Red (Ridda)
const C_TRIBE = "#a3a3a3"; // Neutral Gray
const C_QUR = "#fbbf24"; // Gold
const C_YEMEN = "#0ea5e9"; // Cyan
const C_LAKH = "#fdba74";
const C_GHAS = "#c084fc";

// Highly granular seed points representing exact historical regions
// Lng, Lat coordinates for accurate Voronoi seeding
const REGIONS = [
  // Byzantines
  { id: "b_egypt1", title: "مصر", lng: 30, lat: 29 },
  { id: "b_egypt2", title: "صعيد مصر", lng: 32, lat: 26 },
  { id: "b_egypt3", title: "الإسكندرية", lng: 28, lat: 31 },
  { id: "b_barqa", title: "برقة", lng: 22, lat: 31 },
  { id: "b_ifriqiya", title: "إفريقية (طرابلس وتونس)", lng: 12, lat: 33 },
  { id: "b_cyprus", title: "قبرص", lng: 33, lat: 35 },
  { id: "b_levant1", title: "فلسطين", lng: 35, lat: 31.5 },
  { id: "b_levant2", title: "الشام", lng: 36.5, lat: 34.5 },
  { id: "b_anatolia1", title: "الأناضول", lng: 31, lat: 38 },
  { id: "b_anatolia2", title: "كبادوكيا", lng: 35, lat: 39 },
  { id: "b_anatolia3", title: "أرمينيا", lng: 40, lat: 40 },

  // Sassanids
  { id: "s_iraq1", title: "العراق (السواد)", lng: 45, lat: 32 },
  { id: "s_iraq2", title: "الجزيرة", lng: 43, lat: 35 },
  { id: "s_prs_w", title: "فارس (زاغروس)", lng: 48, lat: 34 },
  { id: "s_prs_c", title: "فارس (أصفهان)", lng: 52, lat: 32 },
  { id: "s_prs_s", title: "إقليم فارس", lng: 54, lat: 29 },
  { id: "s_khur", title: "خراسان", lng: 58, lat: 36 },
  { id: "s_makran", title: "مكران", lng: 62, lat: 27 },

  // Buffer States
  { id: "ghassan", title: "الغساسنة", lng: 37.5, lat: 31.5 },
  { id: "lakhmid", title: "المناذرة (الحيرة)", lng: 43.5, lat: 30.5 },

  // Arabia Core (Faithful)
  { id: "makkah", title: "مكة (قريش)", lng: 40.2, lat: 21.4 },
  { id: "madinah", title: "المدينة (يثرب)", lng: 39.6, lat: 24.5 },
  { id: "tabuk", title: "شمال الحجاز", lng: 37, lat: 28.5 },
  { id: "taif", title: "الطائف (هوازن)", lng: 41.5, lat: 21.0 },

  // Arabia Tribes and regions
  { id: "kinana", title: "كنانة", lng: 39.5, lat: 20.5 },
  { id: "khuzaa", title: "خزاعة", lng: 39.8, lat: 22.0 },
  { id: "yamama", title: "اليمامة (بنو حنيفة)", lng: 45.5, lat: 24 },
  { id: "najd_n", title: "نجد (أسد وغطفان)", lng: 42.5, lat: 27.5 },
  { id: "najd_e", title: "بنو تميم", lng: 47, lat: 27 },
  { id: "bahrain", title: "البحرين (عبدالقيس)", lng: 50, lat: 25 },
  { id: "oman", title: "عُمان", lng: 57, lat: 23 },
  { id: "mehri", title: "المهرة", lng: 53, lat: 17 },
  { id: "hadramaut", title: "حضرموت", lng: 49, lat: 15.5 },
  { id: "yemen_n", title: "نجران", lng: 44, lat: 17.5 },
  { id: "yemen_s", title: "اليمن (حمير)", lng: 44.5, lat: 15.0 },

  // Axum/Abyssinia & Africa Border
  { id: "b_nubia", title: "النوبة", lng: 35, lat: 20 },
  { id: "b_beja", title: "البجة", lng: 36, lat: 18 },
  { id: "axum_core", title: "مملكة أكسوم (الحبشة)", lng: 38.5, lat: 13.5 },
  { id: "axum_north", title: "شمال الحبشة", lng: 38, lat: 16.5 },
  { id: "axum_south", title: "جنوب الحبشة", lng: 39, lat: 11.5 },

  // Sea Masks to block Voronoi from crossing seas
  { id: "sea_red1", title: "البحر الأحمر", lng: 37, lat: 21 },
  { id: "sea_red2", title: "البحر الأحمر", lng: 40, lat: 18 },
  { id: "sea_red3", title: "البحر الأحمر", lng: 42, lat: 14.5 },
  { id: "sea_gulf1", title: "الخليج العربي", lng: 52, lat: 26 },
  { id: "sea_gulf2", title: "الخليج العربي", lng: 54, lat: 25 },
  { id: "sea_med", title: "البحر المتوسط", lng: 32, lat: 33 },
];

// Continuous exact boundary trace to naturally exclude seas (Red Sea, Persian Gulf, Med)
const OUTLINE_LNG_LAT = [
  [15, 32], // Libya
  [29, 31], // Alexandria
  [32.5, 31.2], // Delta
  [34.5, 31.5], // Gaza
  [36, 36], // Antioch
  [27, 36.5], // Aegean
  [27, 41.5], // Istanbul
  [35, 42], // Black Sea S
  [41.5, 42.5], // Georgia
  [45, 45], // Caucasus
  [47, 40], // Caspian W
  [51, 37.5], // Caspian S
  [54, 40], // Caspian E
  [60, 45], // Aral
  [68, 45], // Transoxiana
  [68, 25], // Indian Ocean Edge
  [60, 25.5], // Makran Coast
  [56.5, 26.5], // Iran Hormuz
  [53, 27.5], // Iran Gulf
  [49.5, 30.5], // Shatt Al Arab
  [49, 28], // Saudi Gulf
  [51.5, 25.5], // Qatar
  [56, 24.5], // UAE
  [56.4, 26.1], // Oman Musandam
  [60, 22.5], // Oman Coast
  [54, 16], // Mehri Coast
  [50, 14], // Yemen South
  [43.5, 12.6], // Bab Mandeb (Yemen)
  [42, 16], // Red Sea Yemen
  [39, 21], // Jeddah
  [34.5, 28], // Tabuk Coast
  [35, 29.5], // Aqaba
  [34, 28], // Sinai South
  [32.5, 30], // Suez
  [34, 26], // Egypt Red Sea
  [38, 19], // Sudan
  [43, 12.4], // Bab Mandeb (Africa)
  [51, 10], // Horn Africa
  [42, 5], // South Somalia
  [15, 5], // Deep Africa
  [15, 32], // Loop
];

let landmassPoly: any = null;
try {
  const outline = [...OUTLINE_LNG_LAT];
  if (
    outline[0][0] !== outline[outline.length - 1][0] ||
    outline[0][1] !== outline[outline.length - 1][1]
  ) {
    outline.push(outline[0]);
  }
  // Ensure the polygon is topologically valid and counter-clockwise inside turf
  landmassPoly = turf.polygon([outline]);
} catch (e) {
  // Fallback to strict bounding box if complex polygon errors
  landmassPoly = turf.bboxPolygon([0, 0, 80, 55]);
}

// Generate base Voronoi cells globally ONCE to heavily save CPU
const generateBaseCells = () => {
  const pointsFC = turf.featureCollection(
    REGIONS.map((r) =>
      turf.point([r.lng, r.lat], { id: r.id, title: r.title }),
    ),
  );
  const boundingBox: [number, number, number, number] = [0, 0, 80, 55];
  const voronoiPolygons = turf.voronoi(pointsFC, { bbox: boundingBox });

  const cells = new Map<string, any>();

  voronoiPolygons.features.forEach((poly) => {
    if (!poly) return;
    // Identify which region cell this is
    const matchedPoint = REGIONS.find((r) =>
      turf.booleanPointInPolygon(turf.point([r.lng, r.lat]), poly),
    );
    if (matchedPoint) {
      try {
        // Intersect with perfect coastal trace
        const intersected = turf.intersect(
          turf.featureCollection([poly, landmassPoly]),
        );
        if (intersected) {
          intersected.properties = {
            id: matchedPoint.id,
            title: matchedPoint.title,
          };
          cells.set(matchedPoint.id, intersected as any);
        } else {
          poly.properties = { id: matchedPoint.id, title: matchedPoint.title };
          cells.set(matchedPoint.id, poly);
        }
      } catch (e) {
        // Fallback geometry on clipping failure
        poly.properties = { id: matchedPoint.id, title: matchedPoint.title };
        cells.set(matchedPoint.id, poly);
      }
    }
  });
  return cells;
};

// Application-wide cache
let baseCellsMap: Map<string, any> | null = null;

export const getTerritoriesForYear = (year: number): TerritoryGroup[] => {
  if (!baseCellsMap) {
    baseCellsMap = generateBaseCells();
  }

  const groupsMap = new Map<string, TerritoryGroup>();

  const addToGroup = (
    groupId: string,
    name: string,
    color: string,
    cellId: string,
  ) => {
    if (!groupsMap.has(groupId)) {
      groupsMap.set(groupId, { id: groupId, name, color, polygons: [] });
    }
    const group = groupsMap.get(groupId)!;

    const cellPoly = baseCellsMap?.get(cellId);
    if (!cellPoly) return;

    const specificName = REGIONS.find((r) => r.id === cellId)?.title || name;
    const isEmpire =
      groupId === "isl" ||
      groupId === "byz" ||
      groupId === "sas" ||
      groupId === "ridda" ||
      groupId === "qur" ||
      groupId === "axum";

    // Instead of pushing individual polygons, let's merge them inside the group object later,
    // or just store the turf geometries and union them before returning.

    // For now we store the features
    if (!group.features) group.features = [];
    group.features.push(cellPoly);
    group.isEmpire = isEmpire;
    group.specificName = specificName;
  };

  // Build the geopolitical snapshot based strictly on historical mapping
  REGIONS.forEach((r) => {
    const rId = r.id;
    if (rId.startsWith("sea_")) return; // Skip sea masks completely

    // 1. Before Hijra (< 622)
    if (year < 622) {
      if (rId.startsWith("b_nub") || rId.startsWith("b_bej"))
        addToGroup("nubia", "ممالك النوبة والبجة", "#a0522d", rId);
      else if (rId.startsWith("b_"))
        addToGroup("byz", "الإمبراطورية البيزنطية (الروم)", C_BYZ, rId);
      else if (["bahrain", "oman", "yemen_n", "yemen_s"].includes(rId))
        addToGroup(
          "sas_inf",
          "الإمبراطورية الساسانية والنفوذ التابع",
          "#4b5563",
          rId,
        ); // Darker gray for Sassanid influence
      else if (rId.startsWith("s_") || rId === "lakhmid")
        addToGroup("sas", "الإمبراطورية الساسانية (الفرس)", C_SAS, rId);
      else if (rId.startsWith("axum_"))
        addToGroup("axum", "مملكة أكسوم (الحبشة)", "#0284c7", rId);
      else if (rId === "ghassan")
        addToGroup("ghassan", "مملكة الغساسنة", C_GHAS, rId);
      else if (rId === "makkah" || rId === "kinana" || rId === "taif")
        addToGroup("qur", "قريش والحجاز", C_QUR, rId);
      else if (rId === "madinah")
        addToGroup("mad", "يثرب (الأوس والخزرج)", C_ISLAM, rId);
      else addToGroup(rId, "القبائل العربية المستقلة", C_TRIBE, rId);
    }
    // 2. Madina Era & Early Expansion (622 - 630)
    else if (year >= 622 && year < 630) {
      if (rId.startsWith("b_nub") || rId.startsWith("b_bej"))
        addToGroup("nubia", "ممالك النوبة والبجة", "#a0522d", rId);
      else if (rId.startsWith("b_"))
        addToGroup("byz", "الإمبراطورية البيزنطية", C_BYZ, rId);
      else if (["bahrain", "oman", "yemen_n", "yemen_s"].includes(rId))
        addToGroup(
          "sas_inf",
          "الإمبراطورية الساسانية والنفوذ التابع",
          "#4b5563",
          rId,
        );
      else if (rId.startsWith("s_") || rId === "lakhmid")
        addToGroup("sas", "الإمبراطورية الساسانية", C_SAS, rId);
      else if (rId.startsWith("axum_"))
        addToGroup("axum", "مملكة أكسوم", "#0284c7", rId);
      else if (["madinah", "tabuk", "khuzaa"].includes(rId))
        addToGroup("isl", "الدولة الإسلامية", C_ISLAM, rId);
      else if (
        year < 628 &&
        (rId === "makkah" || rId === "kinana" || rId === "taif")
      )
        addToGroup("qur", "قريش", C_QUR, rId);
      else if (
        year >= 628 &&
        (rId === "makkah" || rId === "kinana" || rId === "taif")
      )
        addToGroup("isl", "الدولة الإسلامية", C_ISLAM, rId);
      else if (rId === "ghassan")
        addToGroup("ghassan", "الغساسنة", C_GHAS, rId);
      else addToGroup(rId, "القبائل العربية", C_TRIBE, rId);
    }
    // 3. Wufud & Late Prophet Era (630 - 632.4)
    else if (year >= 630 && year < 632.4) {
      if (rId.startsWith("b_nub") || rId.startsWith("b_bej"))
        addToGroup("nubia", "ممالك النوبة والبجة", "#a0522d", rId);
      else if (rId.startsWith("b_"))
        addToGroup("byz", "الإمبراطورية البيزنطية", C_BYZ, rId);
      else if (["bahrain", "oman", "yemen_n", "yemen_s"].includes(rId))
        addToGroup("isl", "الدولة الإسلامية", C_ISLAM, rId);
      else if (rId.startsWith("s_") || rId === "lakhmid")
        addToGroup("sas", "الإمبراطورية الساسانية", C_SAS, rId);
      else if (rId.startsWith("axum_"))
        addToGroup("axum", "مملكة أكسوم", "#0284c7", rId);
      else if (rId === "ghassan")
        addToGroup("ghassan", "الغساسنة", C_GHAS, rId);
      else addToGroup("isl", "الدولة الإسلامية", C_ISLAM, rId);
    }
    // 4. Abu Bakr & Ridda Wars (632.4 - 634)
    else if (year >= 632.4 && year < 634) {
      if (rId.startsWith("b_nub") || rId.startsWith("b_bej"))
        addToGroup("nubia", "ممالك النوبة والبجة", "#a0522d", rId);
      else if (["b_levant1", "lakhmid"].includes(rId))
        addToGroup(
          "isl",
          "دولة الخلفاء الراشدين (أبو بكر الصديق)",
          C_ISLAM,
          rId,
        );
      else if (rId.startsWith("b_"))
        addToGroup("byz", "الإمبراطورية البيزنطية", C_BYZ, rId);
      else if (rId.startsWith("s_"))
        addToGroup("sas", "الإمبراطورية الساسانية", C_SAS, rId);
      else if (rId.startsWith("axum_"))
        addToGroup("axum", "مملكة أكسوم (الحبشة)", "#0284c7", rId);
      else if (
        year < 633.8 &&
        ![
          "makkah",
          "madinah",
          "taif",
          "tabuk",
          "ghassan",
          "kinana",
          "khuzaa",
        ].includes(rId)
      ) {
        addToGroup("ridda", "مرتدون (حروب الردة)", C_REBEL, rId);
      } else
        addToGroup(
          "isl",
          "دولة الخلفاء الراشدين (أبو بكر الصديق)",
          C_ISLAM,
          rId,
        );
    }
    // 5. Umar Conquests (634 - 644)
    else if (year >= 634 && year < 644) {
      if (rId.startsWith("b_nub") || rId.startsWith("b_bej"))
        addToGroup("nubia", "ممالك النوبة والبجة", "#a0522d", rId);
      else if (
        [
          "b_anatolia1",
          "b_anatolia2",
          "b_anatolia3",
          "b_cyprus",
          "b_ifriqiya",
        ].includes(rId)
      )
        addToGroup("byz", "الإمبراطورية البيزنطية", C_BYZ, rId);
      else if (["s_prs_c", "s_prs_s", "s_khur", "s_makran"].includes(rId))
        addToGroup("sas", "الإمبراطورية الساسانية (المتقهقرة)", "#4b5563", rId);
      else if (rId.startsWith("axum_"))
        addToGroup("axum", "مملكة أكسوم (الحبشة)", "#0284c7", rId);
      else
        addToGroup(
          "isl",
          "دولة الخلفاء الراشدين (عمر بن الخطاب)",
          C_ISLAM,
          rId,
        );
    }
    // 6. Uthman & Ali (644+)
    else {
      if (rId.startsWith("b_bej"))
        addToGroup("nubia", "ممالك النوبة والبجة", "#a0522d", rId);
      else if (["b_anatolia1", "b_anatolia2"].includes(rId))
        addToGroup("byz", "الإمبراطورية البيزنطية", C_BYZ, rId);
      else if (rId.startsWith("axum_"))
        addToGroup("axum", "مملكة أكسوم (الحبشة)", "#0284c7", rId);
      else addToGroup("isl", "دولة الخلفاء الراشدين", C_ISLAM, rId);
    }
  });

  // Now loop through groupsMap, union the features to create contiguous polygons
  const finalGroups: TerritoryGroup[] = [];
  groupsMap.forEach((group) => {
    if (group.features && group.features.length > 0) {
      let unioned: any = group.features[0];

      // Union for contiguous map if empire or same identity
      for (let i = 1; i < group.features.length; i++) {
        try {
          const u = turf.union(
            turf.featureCollection([unioned, group.features[i]]),
          );
          if (u) unioned = u;
        } catch (e) {
          // Ignore if turf union fails (should be rare)
        }
      }

      const extractRings = (geometry: any): [number, number][][] => {
        if (geometry.type === "Polygon") {
          return geometry.coordinates.map((ring: any) =>
            ring.map((coord: any) => [coord[1], coord[0]] as [number, number]),
          );
        } else if (geometry.type === "MultiPolygon") {
          const allRings: [number, number][][] = [];
          geometry.coordinates.forEach((poly: any) => {
            poly.forEach((ring: any) => {
              allRings.push(
                ring.map(
                  (coord: any) => [coord[1], coord[0]] as [number, number],
                ),
              );
            });
          });
          return allRings;
        }
        return [];
      };

      group.polygons = [
        {
          name: group.isEmpire ? group.name : group.specificName || group.name,
          color: group.color,
          coordinates: extractRings(unioned.geometry),
        },
      ];
    }
    finalGroups.push(group);
  });

  return finalGroups;
};
