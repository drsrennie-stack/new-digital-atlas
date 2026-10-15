# Compliance notes: Atlas "Name it" practice mode

## Project and files covered

- Project: BIO 004 Human Anatomy Digital Atlas (new-digital-atlas), Fall 2026
- Date reviewed: October 14, 2026
- New files: `atlas-name-it.js`, `atlas-competency-map.js`, `compliance-notes-atlas-name-it.md`
- Changed files (24 chapter pages; each gained two script tags, the iframe height sender, and a closing `</body>`):
  abdves, back, blood, bodyplan, bonetissue, brain, bvessels, digest, headneck, heart, joints, leg, muscle, repro, resp, skeleton, skin, spinal, thigh, tissues, uevn, ulbones, upper, urinary (all `.html`)
- Nothing in the page's existing Type answers, Tap to reveal, or Show all modes was changed.

## WCAG version and level

Target: WCAG 2.2, Level AA.

| Criterion | Level | How it is met |
|---|---|---|
| 1.1.1 Non-text Content | A | The practice figure is an `svg role="img"` with a name that gives the card title, says which marker to name, and adds the answer after Reveal. Decorative marker shapes are `aria-hidden`. |
| 1.3.1 Info and Relationships | A | Panel is a `section` labeled by its `h2`. The scope picker has a `label`. The round length is a `fieldset` with a `legend` and real radio inputs. Missed structures are a `ul`. |
| 1.3.2 Meaningful Sequence | A | DOM order matches reading order: figure, progress, prompt, answer, buttons. |
| 1.4.1 Use of Color | A | The target marker is maroon and also shows a "?" and a gold ring. Results are stated in words ("You had 7 of 24"). |
| 1.4.3 Contrast (Minimum) | AA | Every text pair is 6.58:1 or higher. See the audit below. |
| 1.4.4 Resize Text | AA | Fluid layout with wrapping rows; covered by the 390px reflow test. Not separately tested at 200% browser zoom. |
| 1.4.10 Reflow | AA | No horizontal scroll at 390px wide on all 24 pages, in setup, during a round, after Reveal, and on the summary. |
| 1.4.11 Non-text Contrast | AA | Target marker maroon against its white outline 7.66:1. Focus outline maroon on white 7.66:1. Selected chips and the pressed toggle are navy filled. |
| 1.4.12 Text Spacing | AA | No fixed heights on text containers. |
| 1.4.13 Content on Hover or Focus | AA | Nothing appears on hover or focus. |
| 2.1.1 Keyboard | A | Every control is a native button, select, radio or link. Enter or Space reveals; Tab moves between "I had it" and "I missed it". |
| 2.1.2 No Keyboard Trap | A | Escape or "Close Name it" leaves the mode and returns focus to the Name it button. |
| 2.4.3 Focus Order | A | Opening moves focus to the panel heading. After Start and after each mark, focus goes to Reveal. After Reveal, focus goes to "I had it". The summary moves focus to the heading. |
| 2.4.6 Headings and Labels | AA | Plain labels: "Which structures", "How many in a round", "Reveal", "I had it", "I missed it". |
| 2.4.7 Focus Visible | AA | 3px outline on every control, inherited from the page plus explicit rules for the select and the radio chips. |
| 2.4.11 Focus Not Obscured (Minimum) | AA | Buttons carry `scroll-margin-bottom: 96px` so a focused button scrolls clear of the fixed "My weak spots" button. |
| 2.5.3 Label in Name | A | Accessible names match the visible text on every button. |
| 2.5.8 Target Size (Minimum) | AA | All new buttons, chips, the select and the Name it toggle are at least 44px tall (measured 44px in Chromium). |
| 3.2.1 / 3.2.2 On Focus, On Input | A | Choosing a scope or a length changes nothing until Start is pressed. |
| 3.3.2 Labels or Instructions | A | The setup card says what will happen in one short paragraph. |
| 4.1.2 Name, Role, Value | A | The toggle uses `aria-pressed` and `aria-controls`. Radio state is native. |
| 4.1.3 Status Messages | AA | A `role="status"` `aria-live="polite"` region announces "Answer: (name)" on Reveal and "Round done. You had N of M." at the end. |
| 2.3.3 Animation from Interactions (good practice) | AAA | The gold ring pulse only runs under `prefers-reduced-motion: no-preference` (verified: no animation when reduce is set). |

## Color contrast audit (pairs introduced by Name it)

All colors are the atlas's existing tokens. No new colors were added.

| Text | Background | Where | Ratio | Result |
|---|---|---|---|---|
| Navy #0B1530 | White #FFFFFF | Headings, prompt, select, chips, toggle | 18.04:1 | Pass |
| White #FFFFFF | Navy #0B1530 | Pressed toggle, selected chip, Reveal, I had it | 18.04:1 | Pass |
| Maroon #8B3A2E | White #FFFFFF | Progress, card line, I missed it, Mastery OS link, revealed label on the figure | 7.66:1 | Pass |
| Muted #4F576A | White #FFFFFF | Notes, card line in the missed list | 7.23:1 | Pass |
| Navy #0B1530 | Tint #F3F4F7 | Revealed answer | 16.40:1 | Pass |
| Muted #4F576A | Tint #F3F4F7 | Full answer under the short name | 6.58:1 | Pass |
| White #FFFFFF | Maroon #8B3A2E | "?" and number inside the target marker | 7.66:1 | Pass |
| Gold ring #DCB45C | White #FFFFFF | Ring around the target (graphic, not text) | 1.96:1 | Supplementary only. The marker itself carries the 7.66:1 contrast, so the ring is not the sole indicator. |

The revealed label on the figure also has a 7px white stroke behind the letters (the atlas's own label style), so it stays readable over any part of a photo.

## Keyboard flow

1. Tab to "Name it" in the page header, press Enter. Focus lands on the panel heading.
2. Tab to "Which structures" (arrow keys pick a scope), Tab to the round length radios (arrow keys pick 10, 20 or all), Tab to Start, Enter.
3. Focus is on Reveal. Enter or Space reveals. Enter or Space anywhere on the page that is not another control also reveals.
4. Focus moves to "I had it". Enter marks it had. Tab once to "I missed it", Enter marks it missed. Focus returns to Reveal for the next marker.
5. "Stop and see my results" is always one Tab past the answer buttons.
6. On the summary: "Practice the N I missed", "New round", "Back to the cards", and the Mastery OS link.
7. Escape closes Name it from any step (unless the Find a structure search is open) and returns focus to the Name it button.
8. Left and Right arrows are blocked from flipping the hidden cards behind the panel while Name it is open.

## Screen reader checks done

- Chromium accessibility tree (Playwright `aria_snapshot`) for setup and for a revealed marker: region named "Name it before you see it", level 2 heading, labeled combobox with six options, radio group named "How many in a round", image named with card title and instruction, buttons "I had it" and "I missed it", status region reading "Answer: Left brachiocephalic vein".
- Live region text confirmed after Reveal on heart, back, tissues and joints pages.
- Not yet checked with VoiceOver, NVDA or JAWS on real hardware. See below.

## Known limitations and remediation

- Not tested with a desktop or mobile screen reader by a person. Remediation: one pass with VoiceOver on iPhone and NVDA on Windows before the next term.
- The figure label on a wide photo can be small on a phone. The full answer is always shown large in the answer card, so nothing depends on reading the figure label.
- The gold ring is below 3:1 against white. It is decoration around a marker that already meets contrast, so this is not a failure, but a darker ring would be stronger if the atlas palette changes.
- Results reach Mastery OS only when the atlas is opened from drsrennie-stack.github.io, because the two sites share browser storage on that origin. The Canvas file package (README-CANVAS.txt) runs on Canvas's own origin, so Name it practice there is saved for the atlas's own weak spots list but does not reach Mastery OS.
- Some structures on mapped pages do not count toward a competency because no competency names them clearly (for example the deep back muscles, triceps, the named joints cards, the jugular and brachiocephalic veins on the heart cards). They are still practiced and still saved to the per-structure record.
- Evidence saved when a student leaves partway is split into more than one entry. Mastery OS sums entries, so totals are correct.

Reviewer: Claude, at Dr. Rennie's request

## Addendum, October 15, 2026: home page intro

- "My weak spots" stays hidden until the intro ends or is skipped, so it no longer covers Skip intro.
- aria-hidden moved from the whole intro to its three decorative scenes, so Skip intro can be reached by keyboard and screen readers.
