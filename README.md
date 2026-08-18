# AI Innovators — website (v2)

Static site for the AI Innovators learning community at Long Beach City College.
No build step, no dependencies. Plain HTML/CSS/JS — drop it in a repo and it works.

## What changed in v2

- **LBCC brand colors.** Rebuilt on PMS 485 red + process black + white, replacing the navy/gold of v1. All text combinations verified against WCAG AA.
- **Institutional lockup.** LBCC and Strong Workforce identification below the nav and in the footer. Currently typographic — swap in the real logo files (see below).
- **Native interest form.** Lives on the page, submits without leaving it, writes straight to a Google Sheet you own. No Microsoft Forms redirect, no Linktree.
- **Deadline + live countdown.** October 16, 2026 at 10:00 AM, with a countdown bar on the home, program, and join pages.
- **Key dates section.** Oct 12 reminder → Oct 16 deadline → Oct 19 notifications → Oct 23 kickoff.
- **"4 courses, 12 units"** — the old "4 · 12 transferable units" was being read as "4 to 12."
- **Hero prompt text** enlarged to pure white for readability.
- **LBCC class schedule links** on the home and program pages.
- **Certifications page** carries a "still being finalized" notice.

## Files

| File | What it is |
|---|---|
| `index.html` | Landing page — hero, deadline, sequence, key dates, interest form |
| `program.html` | Course sequence, monthly AI touchpoints, tools, FAQ |
| `certifications.html` | Certification pathway and voucher eligibility |
| `capstone.html` | The pitch event: timeline, rubric, judges, attend info |
| `partners.html` | Judge / speak / mentor + partner form |
| `about.html` | Team, model, funding, privacy statement |
| `apply.html` | Interest form, key dates, counselor referral form |
| `styles.css` | All styling. Design tokens at the top |
| `main.js` | Nav, hero typing, countdown, form submission |
| `form-handler.gs` | Google Apps Script — paste into your Sheet, not into the repo build |
| `.nojekyll` | Empty file. Stops GitHub Pages running Jekyll |

Header and footer are duplicated in each file. If you change the nav, change it in all seven.

## Wiring the interest form (do this first — it must be live at launch)

1. Create a Google Sheet in the LBCC/project Drive: "AI Innovators — Interest List".
2. In that Sheet: **Extensions → Apps Script**.
3. Paste in the contents of `form-handler.gs`. Save.
4. **Deploy → New deployment → Web app.** Execute as **Me**; Who has access **Anyone**.
5. Copy the Web app URL.
6. Open `main.js` and paste it into `FORM_ENDPOINT` on line 10.

Three forms feed three tabs, created automatically: `interest`, `referral`, `partner`.

Until `FORM_ENDPOINT` is filled in, the form shows a friendly message pointing people to email rather than silently failing. **Test one submission end to end before you send the link to counselors.**

The Sheet should live in a project or department account, not a personal one. Whoever owns the Sheet owns the student contact data.

## Logos

Both marks are in place: `assets/lbcc-logo.png` (LBCC vertical logo) and
`assets/lbcc-workforce-education-logo.png` (LBCC Workforce Education badge).

They appear in two places on every page — the white bar under the nav, and a
white panel in the footer. Both are supplied on white and are **never**
recolored, cropped, stretched, or placed on a tinted background; the footer
panel exists specifically so the artwork stays on white against the black
footer.

Display heights are set in `styles.css` under "Institutional lockup":
72px / 64px in the header, 58px / 52px in the footer, reduced on small screens.
The circular WE badge is set slightly smaller than the LBCC mark because a
circle reads larger than a stacked wordmark at equal height.

Source files are 180px tall — roughly 2.5× display size, so they stay crisp on
high-DPI screens. If you ever get vector `.svg` versions from Marketing, swap
them in and drop the `width`/`height` attributes.

**Logo use should still be confirmed with Marketing/PIO** as part of the page
review. Having the correct files is not the same as having approval to publish
them.

## Publishing pages in stages

Yolanda's suggestion — launch the landing page, add subpages as they're confirmed — works like this: comment out the nav item, leave the file in place.

```html
<!-- <li><a href="certifications.html">Certifications</a></li> -->
```

The page still exists at its URL but nothing links to it. Uncomment when it's ready. Do this in all seven files so the nav stays consistent.

## Hosting on GitHub Pages

```bash
git init
git add .
git commit -m "AI Innovators site v2"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Then **Settings → Pages → Deploy from a branch → `main` / `(root)`**.

Keep `preview-full-site.html` out of the published repo — if Pages is on, it's publicly reachable at `/preview-full-site.html`, draft banner and all.

## Custom domain: innovatorshub.io

In Namecheap: **Domain List → Manage → Advanced DNS**.

1. Four `A` records, host `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
2. One `CNAME`, host `www` → `USERNAME.github.io.`
3. GitHub **Settings → Pages → Custom domain** → `innovatorshub.io` → Save
4. Wait for DNS, then tick **Enforce HTTPS**

Turn off Namecheap's parking page first. Verify GitHub's current Pages IPs in their docs before relying on them.

Two notes on `.io`: renewals run higher than `.org` (typically $35–70/yr), and the grant can't fund a subscription past June 30, 2027 without an identified alternate source — so plan to fund registration outside the award. Also consider buying `innovatorshub.org` as a defensive registration and redirecting it.

## Before launch

- [ ] Delete the `<div class="draft-flag">` line from all seven files
- [ ] `FORM_ENDPOINT` set in `main.js`, tested with a real submission
- [ ] Marketing/PIO review complete, logos approved and dropped in
- [ ] Confirm AI 45 and AI 40 catalog titles (search `TODO:` across the files)
- [ ] Confirm the Fall B start date against the LBCC class schedule
- [ ] Run [WAVE](https://wave.webaim.org/) on the live URL
- [ ] Test the form on a phone — most students will fill it there
