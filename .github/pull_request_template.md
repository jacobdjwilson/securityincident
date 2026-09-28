## Proposed Incident / Milestone Changes

### Type of Change
- [ ] New incident record (`incidents/YYYY-MM-<target-slug>.md`)
- [ ] Milestone addition to existing incident
- [ ] Status update (e.g. `EMERGING` -> `ACKNOWLEDGED` -> `CONFIRMED` or `REFUTED`)
- [ ] Source link correction or typo fix

### Incident Details
- **Target Organization:** 
- **File Modified / Created:** `incidents/`
- **Updated Status (if applicable):** [ ] EMERGING  [ ] ACKNOWLEDGED  [ ] CONFIRMED  [ ] REFUTED

### Verification Checklist
- [ ] The incident file is named using the `YYYY-MM-<target-slug>.md` standard.
- [ ] All frontmatter fields (`id`, `target`, `domain`, `status`, `first_seen`, `last_updated`, `summary`) are present.
- [ ] Each milestone has an explicit primary source URL (SEC 8-K, target advisory, regulator notice, or archived leak site).
- [ ] The appropriate verification tier (`CONFIRMED BY REGULATOR`, `CONFIRMED BY TARGET`, `UNVERIFIED CLAIM`, etc.) is tagged.
- [ ] Site builds cleanly without errors (`npm run build`).
