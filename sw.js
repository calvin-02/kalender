/* Kalender — Offline-Vorhaltung.
   Bei jeder Änderung an der App FASSUNG hochzählen — hier UND in teile/04_js_daten.html.
   Ohne diesen Schritt bleibt auf den Geräten die alte Fassung liegen. */

const FASSUNG = "kalender-0.2.0";
const LAGER = "kalender-" + FASSUNG;

const HÜLLE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", ev => {
  ev.waitUntil(
    caches.open(LAGER)
      .then(lager => lager.addAll(HÜLLE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", ev => {
  ev.waitUntil(
    caches.keys()
      .then(namen => Promise.all(
        namen.filter(n => n.startsWith("kalender-") && n !== LAGER).map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", ev => {
  const anfrage = ev.request;
  if(anfrage.method !== "GET") return;

  const url = new URL(anfrage.url);

  /* Schriften: erst Lager, dann Netz — und was kommt, wird aufgenommen. */
  if(url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com"){
    ev.respondWith(
      caches.match(anfrage).then(treffer => treffer || fetch(anfrage).then(antwort => {
        const kopie = antwort.clone();
        caches.open(LAGER).then(l => l.put(anfrage, kopie)).catch(() => {});
        return antwort;
      }).catch(() => treffer))
    );
    return;
  }

  /* Fremde Herkunft sonst: unberührt lassen. */
  if(url.origin !== location.origin) return;

  /* Eigene Dateien: Lager zuerst, damit die App ohne Netz startet.
     Parallel im Hintergrund erneuern, damit Änderungen ankommen. */
  ev.respondWith(
    caches.match(anfrage).then(treffer => {
      const ausNetz = fetch(anfrage).then(antwort => {
        if(antwort && antwort.status === 200 && antwort.type === "basic"){
          const kopie = antwort.clone();
          caches.open(LAGER).then(l => l.put(anfrage, kopie)).catch(() => {});
        }
        return antwort;
      }).catch(() => null);

      if(treffer){
        ausNetz.catch(() => {});
        return treffer;
      }
      return ausNetz.then(a => a || caches.match("./index.html"));
    })
  );
});
