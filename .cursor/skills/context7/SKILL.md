---
name: context7
description: >-
  Looks up official, version-aware library/framework/SDK/CLI documentation via
  Context7 (or equivalent doc tools) before changing config or APIs. Use when
  the user mentions Context7, context7, asks to use Context7, or asks for latest
  official docs (including Korean: 최신 문서, 공식 문서, 문서 확인, 라이브러리 문서),
  docs lookup, library upgrade, migration, breaking changes, or to verify
  behavior against current documentation; also when editing dependencies or
  unfamiliar APIs where training data may be stale.
---

# Context7 / official docs first (Photo Guard)

## When to apply

- User explicitly mentions **Context7** or **context7**, or asks to **look up official / up-to-date docs**.
- Changing **library, framework, SDK, or CLI** config or code paths.
- **Version bumps, migrations**, or anything with plausible **breaking changes**.
- Any API or flag where **staleness risk** is high even if it feels familiar.

## Agent workflow

1. **Pin scope and version**  
   Identify the exact package or tool and the **version this repo actually uses** (`package.json`, lockfile, or the relevant config). State that version when querying docs.

2. **Fetch docs (no guessing)**
   - If **Context7 MCP** (or project-equivalent doc tool) is available, query **official** sources through it.
   - If not available or it errors, open **official** documentation URLs (release notes / migration guides included) via web fetch.
   - Do **not** invent options, defaults, or API shapes from memory.

3. **Extract**
   - Usage that matches **this repo’s version** (or call out mismatch explicitly).
   - Required config, options, deprecations, and caveats.
   - Prefer **section titles + URLs** (or Context7-provided citations) as evidence.

4. **Answer**
   - Tie recommendations to **evidence** (“per docs …”, with link or section).
   - If docs target another major, separate **repo version** vs **doc version**.

5. **Leave a trail in the repo**  
   If the decision affects code or config, add a short note under `docs/references/`.
   - Example path: `docs/references/<package>-v<major>.md`
   - Include: lookup date (use the conversation’s authoritative “today”), locked version, 3–7 line conclusion, links.
   - Keep naming consistent with `docs/references/README.md`.

## Hard no

- No “probably works” API or CLI flags without a doc pass when this skill was triggered.
- Do not treat random blog posts as overriding **official** docs; if they conflict, prefer official sources and say so.

## If tools are missing or ambiguous

- Fall back to **official** sites and version-specific pages; include migration guides when upgrading.
- If the package is unclear, narrow candidates from `package.json` or ask the user for the exact name.
- If docs cover multiple majors, quote only what applies to **this repo’s locked version**.
