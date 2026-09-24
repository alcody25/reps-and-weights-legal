# Privacy Site Compliance Testing

## Outcome

Every legal-site change checks that the deployed source remains a static, no-tracking website consistent with its privacy policy.

## Acceptance Criteria

- [ ] The site contains no scripts, iframes, embedded objects, forms, cookies, or browser storage.
- [ ] Stylesheets, icons, and other automatically loaded resources remain local.
- [ ] External hyperlinks are limited to reviewed GitHub destinations and are never loaded automatically.
- [ ] The policy retains its no-tracking disclosure and required app privacy disclosures.
- [ ] Pull requests run the tests before merge.
- [ ] Pages deployment runs the tests before publishing.
- [ ] The repository records Cody Development Playbook v1.0 adoption.

## Rollback

Revert the test and workflow commit. The previously deployed static site remains available while a corrected change is prepared.
