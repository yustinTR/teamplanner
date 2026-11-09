# GTM container import

`gtm-app-events.json` adds one GA4 event tag ("GA4 - app events") fired by one
custom-event trigger whose regex lists every `trackEvent` name in `src/`, plus a
data-layer variable per event parameter.

Import: Tag Manager → Beheer → Container importeren → choose the file → workspace
"Default Workspace" → **Samenvoegen** + **Conflicterende tags, triggers en
variabelen overschrijven** → confirm → Verzenden.

When you add a new `trackEvent(...)` name or parameter, add it to the regex and
the variable list here and re-import.
