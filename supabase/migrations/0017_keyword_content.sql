-- Keyword content release (Oct 2026): 2 new city pages and 14 new guides.
-- Inserted once; existing rows are never overwritten, so later edits in the admin are kept.

insert into public.service_areas (slug, name, region, intro, lat, lng, sort) values
  ('rancho-cucamonga', 'Rancho Cucamonga', 'Southern California', 'Rancho Cucamonga''s warehouses south of Foothill Boulevard and its yards near the I-15 and the 210 keep a lot of trucks moving. We bring Clean Truck Check testing to your Rancho Cucamonga, Etiwanda or Alta Loma location, so trucks get tested where they park.', 34.11, -117.59, 24),
  ('rialto', 'Rialto', 'Southern California', 'Rialto sits between the 210 and the I-10, with distribution centers, truck yards and owner-operator lots on both sides of town. We bring Clean Truck Check testing to Rialto and neighboring Bloomington, Colton and Fontana, so your trucks get tested without leaving the yard.', 34.11, -117.37, 25)
on conflict (slug) do nothing;

insert into public.posts (slug, title, excerpt, body, published_at, published) values
  ('ctc-vis-registration-guide', 'CTC-VIS registration: how to register your truck', 'A plain-English CTC-VIS registration guide: set up your account, add each truck, pay CARB''s fee and check compliance status before a deadline sneaks up.', '**Short answer:** CTC-VIS registration means reporting each covered truck in CARB''s Clean Truck Check Vehicle Inspection System and paying CARB''s annual compliance fee for it. After that, a credentialed tester submits passing test results, and you check the truck''s compliance status and deadlines in your CTC-VIS account.

## What CTC-VIS is and why you need it

CTC-VIS is the online system CARB uses to run the Clean Truck Check program. It is where owners report vehicles, pay the compliance fee and see each truck''s status. If a covered truck is not reported there, it cannot show as compliant, even if it passes a test.

Most diesel and alternative-fuel vehicles over 14,000 lb GVWR that operate in California need to be in CTC-VIS. That includes trucks registered in other states and other countries. Buses, refuse trucks, construction and agricultural vehicles and motorhomes over 14,000 lb can be covered too, so check CARB''s rules for your vehicle if you are not sure.

One thing to know up front: CTC-VIS belongs to CARB. Diesel Dynamix is an independent testing service, not CARB or a government agency. We can walk you through it, but your account is yours.

## How to register a truck in Clean Truck Check, step by step

The clean truck check registration process comes down to a few steps. Screens and wording change over time, so follow the prompts in the portal itself.

1. **Open the Clean Truck Check portal.** Start from [CARB''s Clean Truck Check page](https://ww2.arb.ca.gov/our-work/programs/CTC), which links to CTC-VIS and CARB''s own instructions.
2. **Set up your CTC-VIS account.** Use the business or owner name that matches your vehicle records, and an email address you actually check. Deadline notices and account messages go there.
3. **Add each vehicle.** Enter the VIN and the other vehicle details CTC-VIS asks for. Double-check the VIN character by character. A single wrong digit causes problems later when test results try to match the truck.
4. **Pay the annual compliance fee.** CARB charges this fee per vehicle, and the amount is shown in CTC-VIS. More on that in our [compliance fee guide](/blog/clean-truck-check-compliance-fee-explained).
5. **Get each truck tested.** A credentialed tester runs the right test and submits the result to CARB.
6. **Check the status.** Log back in and confirm each truck shows compliant, and note the next due date.

### Setting up a CTC-VIS fleet account

If you run more than one truck, put them all under one CTC-VIS account so you can see every VIN in one place. Keep a simple list outside the portal too: VIN, unit number, engine model year, test type and next due date. That list makes it easy to group trucks by deadline and test several in one visit. See [fleet testing](/services/fleet-testing) for how we handle multi-truck yards.

### CTC-VIS registration for out-of-state trucks

Out-of-state and international trucks that operate in California are covered, and they register in CTC-VIS the same way. Report the truck, pay the fee and keep its tests current. Our post on [out-of-state trucks](/blog/clean-truck-check-out-of-state-trucks) covers the details.

## How to pay the Clean Truck Check fee in CTC-VIS

CTC-VIS fee payment happens inside your account. The compliance fee is annual and per vehicle, and CARB sets the amount. We do not quote it here because CARB can change it. Your account shows what is owed for each truck.

Keep in mind that this fee is separate from the testing fee your tester charges. Paying one does not cover the other.

## Test submission and checking your compliance status

You do not upload test results yourself. The credentialed tester submits them after the test. Once a passing result is on record, the fee is paid and the truck is reported, CTC-VIS can show the truck as compliant.

To run a clean truck check status lookup, log in and open the vehicle by VIN. This is also where you check your deadlines. Most covered trucks currently test twice a year, and the schedule can change, so trust what CTC-VIS shows for your truck over any general rule. See [how often trucks need testing](/blog/how-often-do-trucks-need-clean-truck-check).

### Finding your compliance certificate

Proof of compliance lives in CTC-VIS. If you need a CTC-VIS compliance certificate for a customer, a broker or your own records, look in the vehicle''s record in your account. If you cannot find it, contact CARB''s Clean Truck Check help through the CARB site.

## When CTC-VIS is not working or your test is missing

Most "CTC-VIS not working" problems come down to a few things:

- **VIN mismatch.** The VIN in your account does not match the VIN the truck reports. Fix the vehicle record or have a repair shop check the engine computer.
- **Vehicle not reported.** The test happened, but the truck was never added to the account.
- **Fee not paid.** A truck with an unpaid fee will not show as compliant.
- **Login or account access.** Password and account issues go to CARB, since they run the system.

If a test still does not show, ask your tester to confirm it was submitted. Our [failed Clean Truck Check guide](/blog/failed-clean-truck-check-what-to-do) covers VIN mismatches and rejected results in more depth.

## Clean Truck Check reporting requirements and deadlines

Report every covered vehicle, keep the annual fee paid and pass each test before its deadline. That is the whole job. Registration deadlines and test deadlines are set by CARB for each vehicle, so check CTC-VIS or CARB for the exact dates that apply to you. Missing them can lead to a [DMV registration hold](/blog/dmv-registration-hold-clean-truck-check) for California-registered trucks, plus CARB citations and penalties.

If something about your truck changes, such as ownership, plates or whether it still operates in California, update the vehicle info in CTC-VIS so your records stay accurate.

## How Diesel Dynamix helps

We test trucks on site across Southern California, at your yard, jobsite, terminal, port or home. If you need clean truck check registration help in Southern California, we answer CTC-VIS questions, explain results in plain English and give you each truck''s next due date. Fleets get reminders, recurring visits and records per truck and VIN.

- [How testing works](/services/how-testing-works)
- [CARB OBD testing](/services/obd-testing) and [smoke opacity testing](/services/smoke-opacity-test)
- [Clean Truck Check FAQ](/clean-truck-check/faq)

Ready to test? [Book online](/book), or call, text or WhatsApp **(858) 342-8328**.', '2026-10-24', true),
  ('clean-truck-check-compliance-fee-explained', 'Clean Truck Check compliance fee, explained', 'What the Clean Truck Check compliance fee is, who pays it, when it''s due and why it''s separate from your test cost. Avoid a surprise DMV hold.', '**Short answer:** the Clean Truck Check compliance fee is an annual, per-vehicle fee that owners pay to CARB in the CTC-VIS system. CARB sets the amount and shows it in CTC-VIS. It is separate from the testing fee, which your tester charges for each test.

## What the Clean Truck Check compliance fee is

Every covered vehicle in the Clean Truck Check program carries an annual compliance fee. You pay it to CARB, not to a tester, and you pay it inside CTC-VIS when you report the vehicle.

The fee applies to most diesel and alternative-fuel vehicles over 14,000 lb GVWR that operate in California. That includes trucks, and also buses, refuse trucks, construction and agricultural vehicles and motorhomes over 14,000 lb where they fall under the program. If you are not sure your vehicle is covered, check CARB''s rules for your vehicle.

## How much is the fee?

The amount is set by CARB and shown in CTC-VIS. We do not state an amount here because CARB sets it and can change it, and an old number is worse than no number. Log in to CTC-VIS or check [CARB''s Clean Truck Check page](https://ww2.arb.ca.gov/our-work/programs/CTC) for the current clean truck check fee per vehicle.

What we can say for certain:

- It is charged **per vehicle**, not per fleet.
- It is charged **annually**.
- It is paid **to CARB in CTC-VIS**.

## Compliance fee vs test cost

These are two different payments, and mixing them up is one of the most common Clean Truck Check mistakes.

**The compliance fee:**

- Is paid to CARB
- Is paid inside CTC-VIS
- Is due once a year for each vehicle
- Has an amount set by CARB

**The testing fee:**

- Is paid to your credentialed tester
- Is paid directly to the tester, not through CTC-VIS
- Is due each time the truck is tested
- Has an amount set by the tester

Paying the compliance fee does not test your truck. Passing a test does not pay the fee. A truck needs both to be compliant, plus it must be reported in CTC-VIS.

Our testing price depends on how many trucks you have, the test type and your location, with per-truck pricing for fleets. For the full budgeting picture, see [how much Clean Truck Check costs](/blog/how-much-does-clean-truck-check-cost-california).

## When is the Clean Truck Check fee due?

The fee is due annually for each vehicle. The exact due date for your truck is set by CARB and shown in CTC-VIS, so check your account rather than guessing. The simplest habit is to pay the fee when you first report a truck and then renew it each year before its date comes around.

### Do I pay the Clean Truck Check fee every year?

Yes. The compliance fee is annual. As long as a covered vehicle operates in California, plan on paying it every year for that vehicle.

## What happens if the fee is not paid?

A truck with an unpaid fee is not compliant, even if it has passed its emissions test. For California-registered vehicles, non-compliance can lead to a [DMV registration hold](/blog/dmv-registration-hold-clean-truck-check). CARB can also issue citations and penalties for non-compliant vehicles.

If you got a DMV notice and your truck already passed its test, an unpaid fee is one of the first things to check in CTC-VIS.

## Do out-of-state trucks pay the fee?

Yes. Out-of-state and international trucks that operate in California are covered by Clean Truck Check. They are reported in CTC-VIS and pay the annual compliance fee per vehicle, the same as California trucks. See our post on [out-of-state trucks](/blog/clean-truck-check-out-of-state-trucks).

## Budgeting the fee for a fleet

Because the fee is per vehicle, a fleet''s total grows with every truck you report. A few habits keep it from becoming a surprise:

- **Count only covered vehicles.** Trucks under 14,000 lb GVWR are generally not part of the program. For edge cases, check CARB''s rules for your vehicle.
- **Report new trucks as soon as they start operating in California,** so the fee and the first test are not forgotten.
- **Update CTC-VIS when a truck is sold or stops operating in California,** so your records match your real fleet.
- **Plan the fee and the tests together.** Most covered trucks currently test twice a year, so a year of compliance for one truck usually means one fee plus the tests CARB requires.

## Invoices and refunds

The compliance fee is paid through CTC-VIS, so records of that payment live in your CTC-VIS account. Keep a copy with your other records for each truck.

Questions about a CARB compliance fee invoice, a duplicate charge or a clean truck check fee refund go to CARB, because CARB collects the fee. A tester cannot issue refunds for CARB''s fee.

## A simple fee checklist for owners and fleets

1. Report every covered vehicle in CTC-VIS. Our [CTC-VIS registration guide](/blog/ctc-vis-registration-guide) walks through it.
2. Pay the annual compliance fee for each vehicle.
3. Note each truck''s fee date and test deadlines in one list, by VIN.
4. Book testing early so trucks pass before their window closes.
5. After each test, confirm in CTC-VIS that the truck shows compliant.

## How Diesel Dynamix helps

We are an independent testing service, not CARB, so we do not collect the compliance fee. What we do is make the testing side easy. We test on site at your yard, jobsite, terminal, port or home across Southern California, explain results in plain English, help with CTC-VIS questions and give you the next due date for each truck. Fleets get reminders, recurring visits and records per VIN.

- [Our services](/services)
- [Fleet testing](/services/fleet-testing)
- [Clean Truck Check requirements](/clean-truck-check)

[Book a test](/book), or call, text or WhatsApp **(858) 342-8328** for a quote.', '2026-10-24', true),
  ('dmv-registration-hold-clean-truck-check', 'Clean Truck Check DMV registration hold: how to clear it', 'Got a DMV registration hold for CARB Clean Truck Check? Learn why it happens, what clears it and how to get your truck tested fast in Southern California.', '**Short answer:** a DMV registration hold for Clean Truck Check means CARB''s records show your California-registered truck is not compliant. To clear it, make sure the truck is reported in CTC-VIS, the annual compliance fee is paid and a passing test is on record. Then check CTC-VIS until the truck shows compliant.

## Why the DMV says CARB compliance is required for your truck

The California DMV can hold registration renewal for vehicles that are not compliant with Clean Truck Check. If your renewal notice or the DMV counter says CARB compliance is required, the DMV is not judging your truck itself. It is reflecting what CARB''s system shows.

A CARB hold on registration usually traces back to one of these:

- **No passing test on record** for the current period, often from a [missed deadline](/blog/missed-clean-truck-check-deadline).
- **The truck is not reported** in CTC-VIS.
- **The annual compliance fee is unpaid.** See the [compliance fee guide](/blog/clean-truck-check-compliance-fee-explained).
- **A test that did not match the truck,** for example because of a VIN mismatch between the vehicle record and the engine computer.
- **A failed test** that has not been followed by a repair and a passing retest.

The program covers most diesel and alternative-fuel vehicles over 14,000 lb GVWR. If you believe your vehicle should not be covered, check CARB''s rules for your vehicle before you spend money on testing.

## How to remove a DMV hold for Clean Truck Check

Clearing the hold is a compliance problem, not a DMV problem. Work through it in this order.

1. **Log in to CTC-VIS** and find the truck by VIN. If you do not have an account yet, start with our [CTC-VIS registration guide](/blog/ctc-vis-registration-guide).
2. **Confirm the truck is reported** and the VIN in the record is exactly right.
3. **Pay any outstanding compliance fee** for that vehicle.
4. **Look at the test status.** If there is no passing test for the current period, book one right away.
5. **If the truck has a known problem,** such as a check engine light or emissions fault, get it repaired first so it can pass. Our posts on [failed tests](/blog/failed-clean-truck-check-what-to-do) and [readiness monitors](/blog/readiness-monitors-check-engine-light-clean-truck-check) explain what to look for.
6. **After the passing test,** check CTC-VIS again and confirm the truck shows compliant.

Once CARB''s records show the truck as compliant, renew your registration with the DMV as usual.

## How long until the hold clears after a passed test?

CARB and the DMV control how quickly records update, and we cannot promise a release time. Allow time for the passing result and status to show in CTC-VIS. If the truck shows compliant in CTC-VIS and the DMV still shows a hold, contact CARB''s Clean Truck Check help through [CARB''s Clean Truck Check page](https://ww2.arb.ca.gov/our-work/programs/CTC).

The practical lesson: do not wait until the week your registration expires. Test early, so there is room for a repair and retest if one is needed.

## Can you renew registration while the hold is pending?

That decision belongs to the DMV and CARB. Check with them about your specific situation. In most cases, the fastest route back to a normal renewal is getting the truck compliant in CTC-VIS as soon as possible.

Keep in mind that a registration problem is not the only risk. Non-compliant trucks can also receive CARB citations and penalties.

## Can a mobile tester clear my DMV hold?

A mobile tester can run the test that gets you compliant, but the hold itself is released through CARB''s and the DMV''s systems. What a tester does is:

- Run the right test for your truck: a CARB-verified OBD test for 2013 and newer diesel and 2018 and newer alternative-fuel engines, or a smoke opacity test plus visual inspection for 2012 and older diesel without OBD.
- Submit the result to CARB.
- Explain the result, including what to fix if the truck fails.

Coming to you matters when a truck is under a hold. You do not need to drive across town to a test site, and the truck can be tested where it is parked.

## DMV holds in Los Angeles, the Inland Empire and beyond

We see registration hold questions all over Southern California, from yards near the [Port of Los Angeles](/service-areas/ports/port-of-los-angeles) and [Long Beach](/service-areas/long-beach) to warehouses in [Ontario](/service-areas/ontario), [Fontana](/service-areas/fontana) and across the [Inland Empire](/service-areas/inland-empire). We also test in [San Diego](/service-areas/san-diego), [Orange County](/service-areas/orange-county) and [El Centro](/service-areas/el-centro). The fix is the same everywhere: report, pay, pass and confirm.

## What to have ready when you book

Getting a truck tested fast is easier when you have the basics on hand:

- The VIN, and the plate if you have it
- The engine model year, so we know which test the truck needs
- Where the truck is parked, plus keys and cab access
- Any warning lights or known problems, so you can decide whether a repair should come first

## How to avoid the next hold

- Keep every truck''s due dates in one place, by VIN.
- Pay the compliance fee each year without waiting for a reminder.
- Fix check engine lights and emissions faults between tests.
- Book testing early in each window.
- For fleets, set up recurring visits so no truck slips through.

## How Diesel Dynamix helps

We are an independent testing service, not CARB or the DMV. We test on site at your yard, jobsite, terminal, port or home, help with CTC-VIS questions, explain results in plain English and give you the next due date. Fleets get reminders, recurring visits, early-morning visits and records per truck.

- [Mobile testing services](/services)
- [Fleet testing](/services/fleet-testing)
- [Service areas](/service-areas)

Need a test to clear a hold? [Book online](/book), or call, text or WhatsApp **(858) 342-8328**.', '2026-10-24', true),
  ('failed-clean-truck-check-what-to-do', 'Failed Clean Truck Check? What to do next', 'Failed Clean Truck Check? Learn the common causes of OBD and smoke test failures, VIN mismatches and no-communication errors, and how to retest.', '**Short answer:** if your truck fails Clean Truck Check, it is not compliant until it passes. Find out why it failed, get the problem repaired, then retest. Most failures come from a check engine light, readiness monitors not set, DPF or other emissions faults, or tampered or deleted equipment.

## What happens if your truck fails Clean Truck Check

A failed test does not take your truck off the road by itself, but it does leave the truck non-compliant. Test results are submitted to CARB''s system, and the truck stays non-compliant until a passing result is on record. If the deadline passes while the truck is non-compliant, California-registered vehicles can face a [DMV registration hold](/blog/dmv-registration-hold-clean-truck-check), and CARB can issue citations and penalties.

The good news: a failed test tells you exactly what to work on. The sooner you act, the more room you have before the deadline.

## Why trucks fail the OBD test

The CARB-verified OBD test applies to 2013 and newer diesel engines and 2018 and newer alternative-fuel engines. It reads data from the truck''s engine computer. Common reasons a truck failed the OBD test:

- **Check engine light (MIL) on.** An active emissions fault is a common cause of failure.
- **Readiness monitors not set.** Often after codes were cleared or the battery was disconnected. See our post on [readiness monitors and the check engine light](/blog/readiness-monitors-check-engine-light-clean-truck-check).
- **Emissions system faults.** NOx sensor, DEF system, SCR, EGR and DPF faults all show up here.
- **Tampered or deleted equipment.** Deleted or tampered systems fail, and they are illegal. More in our [DPF and deletes post](/blog/dpf-deletes-and-smoke-clean-truck-check).

## Why trucks fail the smoke opacity test

For 2012 and older diesel without OBD, the test is a smoke opacity test plus a visual inspection. A truck failed the smoke test usually because of:

- Too much smoke from worn injectors, a dirty air filter, turbo problems or a cracked or plugged DPF
- An engine that was not fully warmed up
- Missing, disconnected or tampered emissions parts found in the visual inspection

Our guide on [how to pass the CARB smoke test](/blog/how-to-pass-carb-smoke-test) covers prep in detail.

## Clean Truck Check VIN mismatch

An OBD test can be rejected when the VIN the truck reports does not match the VIN on record. A VIN mismatch failure usually comes from one of two places:

1. **The vehicle record in CTC-VIS has a typo.** Check the VIN in your account against the truck character by character and correct it.
2. **The engine computer reports a different VIN.** This can happen when an engine control module has been replaced or reprogrammed. A dealer or qualified repair shop will need to look at it.

If your carb obd test result was rejected and you are not sure why, ask your tester to explain the message they received.

## When the truck will not communicate with the OBD tester

Sometimes the tester cannot connect to the truck at all. An OBD communication failure is not the same as a failed emissions result, but you still cannot pass until it is fixed. Things to check with your repair shop:

- A damaged OBD port, pins or wiring
- Blown fuses for the diagnostic circuit
- An ECM that is not responding
- Aftermarket devices plugged into the diagnostic connector

If the truck still will not talk to the tester after repairs, check CARB''s rules for your situation, since CARB decides how these cases are handled.

## How to fix a failed test and get compliant again

1. **Get the details.** Ask your tester what failed, in plain English.
2. **Take the truck to a qualified diesel emissions repair shop.** Bring the test result with you.
3. **Fix the root cause.** Clearing codes alone does not fix anything and resets readiness monitors, which can cause another failure.
4. **Drive the truck normally** after the repair so its monitors can set, following the shop''s advice.
5. **Retest.** Book the retest once the repair is done.
6. **Confirm in CTC-VIS** that the truck shows compliant. If a test result is not showing in CTC-VIS, see our [CTC-VIS guide](/blog/ctc-vis-registration-guide).

### How soon can you retest, and how many times?

You can book a clean truck check retest after the repair is done. CARB sets any rules on retest timing and on what happens after repeated failures, so check CARB or CTC-VIS for your truck. In practice, the limit is usually how fast the repair gets done and the monitors set.

### What about repair cost?

Repair costs depend entirely on what failed and on your shop. A loose connection and a failed aftertreatment part are very different jobs. Get a written estimate from the repair shop before work starts.

## Why your truck shows non-compliant even after testing

If the truck passed but still shows non-compliant, look for:

- An unpaid annual compliance fee
- A truck that is not reported in CTC-VIS
- A VIN mismatch that kept the result from matching the truck

## How Diesel Dynamix helps

We test and explain. We do not do repairs, so there is no conflict between the result and a repair bill. We test on site across Southern California at your yard, jobsite, terminal, port or home, tell you in plain English why a truck failed and come back to retest after your shop fixes it. Fleets get reminders, recurring visits and records per truck and VIN.

- [CARB OBD testing](/services/obd-testing)
- [Smoke opacity testing](/services/smoke-opacity-test)
- [How testing works](/services/how-testing-works)

Ready for a retest? [Book online](/book), or call, text or WhatsApp **(858) 342-8328**.', '2026-10-24', true),
  ('readiness-monitors-check-engine-light-clean-truck-check', 'Check engine light and Clean Truck Check: will you pass?', 'Will a check engine light or unset readiness monitors fail Clean Truck Check? What the CARB OBD test looks at and how to get your truck ready to pass.', '**Short answer:** a check engine light that is on because of an emissions fault is a common reason trucks fail the Clean Truck Check OBD test. Readiness monitors that are not set are another. Fix the fault, drive the truck normally so the monitors complete, and do not clear codes right before the test.

## How the CARB OBD test reads your truck

The CARB-verified OBD test applies to 2013 and newer diesel engines and 2018 and newer alternative-fuel engines. Instead of measuring smoke, the tester connects to the truck''s diagnostic port and reads what the engine computer reports about its emissions systems.

Two things in that data cause most problems:

- **The malfunction indicator lamp (MIL),** better known as the check engine light
- **Readiness monitors,** the self-checks the truck runs on its emissions systems

CARB sets the exact pass and fail criteria. This post explains the ideas so you know what to watch for. For the official rules, check [CARB''s Clean Truck Check page](https://ww2.arb.ca.gov/our-work/programs/CTC).

## Will a check engine light fail Clean Truck Check?

A check engine light on because of an emissions fault is one of the most common reasons a truck fails. When the computer commands the MIL on, it is telling the tester that an emissions system has a problem it has confirmed.

Common sources on heavy-duty diesels include NOx sensors, the DEF and SCR system, EGR faults and DPF faults. On a semi truck, a check engine light before an emissions test is your cue to get it diagnosed now, not the day before.

### What to do if the light is on

1. Have a qualified repair shop read the codes and find the cause.
2. Fix the cause, not just the light.
3. Drive the truck normally afterward so the monitors complete.
4. Then book the test.

## What readiness monitors are

Readiness monitors are the truck''s own tests of its emissions systems. Each monitor runs when the right driving conditions happen and then reports as ready (complete) or not ready (incomplete).

When readiness monitors are not ready, the truck has not yet finished checking itself. That is a common reason for an OBD failure even when nothing is broken. You may see it described as an "OBD not ready" result.

### How many monitors can be not ready?

CARB decides how many readiness monitors may be incomplete, and the answer can depend on the vehicle. We do not give a number here because it is CARB''s rule to set. Check CARB, or ask us before the test and we will explain what applies to your truck.

## How to set readiness monitors on a diesel truck

Monitors set themselves when the truck is driven through the conditions each one needs, often called a drive cycle. The exact diesel truck drive cycle varies by engine maker and model.

- **Drive the truck normally** for a while after any repair, including highway and steady-speed driving where possible.
- **Do not keep restarting** a short idle-and-stop routine and expect monitors to set.
- **Ask your dealer or repair shop** for the drive cycle for your engine. Freightliner Cascadia, Peterbilt and other platforms each follow the engine maker''s procedure.
- **Make sure no faults return.** If the light comes back on, the repair is not finished.

## Should you clear codes before the test?

No. Clearing codes turns the light off but does not fix anything. It also resets readiness monitors to not ready, so a truck with cleared codes is often not ready for the OBD test. Disconnecting the battery on a semi truck can have the same effect.

If a shop cleared codes as part of a repair, give the truck time and miles to set its monitors before you test.

## Pending and permanent codes

The OBD system stores different kinds of codes:

- **Pending codes** point to a fault the computer has seen but not yet confirmed.
- **Permanent codes** stay in memory even after codes are cleared, until the truck''s own monitoring confirms the repair worked.

How CARB treats each type in the Clean Truck Check pass criteria is set by CARB, so check CARB for your vehicle. Practically, a pending code is an early warning to get looked at, and a permanent code means the system still needs to verify a repair through normal driving.

## Readiness and the check engine light for fleets

For a fleet, one truck with a light on can throw off a whole test day. Ask drivers to report check engine lights as soon as they appear, and get those trucks to the shop between test windows. Keep a note by VIN of any recent repairs or cleared codes, so you know which trucks may need more driving before they are ready.

The same ideas apply to 2018 and newer alternative-fuel engines, which also take the OBD test.

## A pre-test checklist

- No check engine light on
- No known emissions faults (DEF, SCR, NOx, EGR, DPF)
- No codes cleared or battery disconnected recently
- Normal driving since the last repair
- Diagnostic port and connector in good shape
- Correct VIN on record in CTC-VIS

## If the truck fails anyway

You will know exactly what to fix. See [what to do after a failed Clean Truck Check](/blog/failed-clean-truck-check-what-to-do). For older non-OBD diesels, the test is different; see [how to pass the CARB smoke test](/blog/how-to-pass-carb-smoke-test).

## How Diesel Dynamix helps

We run the CARB-verified OBD test on site at your yard, jobsite, terminal, port or home across Southern California. We explain results in plain English, including which monitors were not ready or which fault caused a failure, so your shop knows where to start. We do not do repairs; we test and explain, then retest when you are ready.

- [CARB OBD testing](/services/obd-testing)
- [How testing works](/services/how-testing-works)
- [Fleet testing](/services/fleet-testing)

[Book a test](/book), or call, text or WhatsApp **(858) 342-8328**.', '2026-10-24', true),
  ('dpf-deletes-and-smoke-clean-truck-check', 'DPF deletes, smoke and Clean Truck Check', 'Will a DPF or EGR delete pass Clean Truck Check? No. Here''s why deleted trucks fail, what causes excess smoke and how a legal, working truck passes.', '**Short answer:** no, a DPF-deleted, EGR-deleted or emissions-tampered truck will not pass Clean Truck Check. Deleted or tampered systems fail, and they are illegal. Diesel Dynamix does not remove, bypass or help hide emissions equipment. A truck with its emissions systems intact and working is the only way to pass.

## Deleted and tampered trucks fail. Full stop.

This needs to be said plainly because there is a lot of bad advice out there. Removing or disabling a diesel particulate filter (DPF), EGR valve, SCR system or other emissions equipment is illegal. Tuning an engine computer to hide that equipment is tampering too.

Tampered or deleted equipment is one of the common reasons trucks fail:

- **On the OBD test** (2013 and newer diesel, 2018 and newer alternative fuel), the tester reads the engine computer. A deleted or tuned truck will not report the way a working, unmodified system does.
- **On the smoke opacity test** (2012 and older diesel without OBD), the visual inspection checks emissions-control parts. Missing, disconnected or tampered parts fail the truck even if the smoke reading looks fine.

Beyond failing the test, non-compliant and tampered trucks face CARB citations and penalties, and California-registered vehicles can face a [DMV registration hold](/blog/dmv-registration-hold-clean-truck-check). CARB sets the penalty amounts, so check CARB for current figures. For the reasons behind the rules, see [why California enforces Clean Truck Check](/clean-truck-check/why-california-enforces-it).

**Our policy:** we test and explain. We do not remove, bypass, tune out or otherwise defeat emissions equipment, and we do not help anyone pass with a deleted truck.

## Can a reinstalled DPF pass Clean Truck Check?

A truck that has had its emissions equipment properly restored, and whose systems are working, can be tested like any other truck. It still has to pass on its own. Work with a qualified diesel emissions repair shop to restore the correct parts and software, then drive the truck normally so readiness monitors can set before you test. See our post on [readiness monitors and the check engine light](/blog/readiness-monitors-check-engine-light-clean-truck-check).

## DPF faults and the OBD test

You do not need a delete for the DPF to cause trouble. A DPF fault code or warning on an OBD-equipped truck is an emissions fault, and an emissions fault with the check engine light on is a common reason for failure.

If your dash shows a DPF warning or the truck is overdue for a regeneration, deal with it before the test:

- Follow the engine maker''s procedure for regeneration.
- If regeneration does not clear the warning, have a repair shop check the DPF and its sensors.
- Ask your shop whether DPF cleaning is due.

Do not clear codes right before the test. That resets readiness monitors and can cause a failure on its own.

## What causes excess smoke on the opacity test

For older non-OBD diesels, the smoke opacity test measures how much smoke the exhaust gives off. Common causes of excessive smoke:

- **Worn or leaking injectors**
- **A dirty air filter or restricted intake**
- **Turbo problems**
- **Exhaust leaks**
- **A cracked or plugged DPF**
- **A cold engine.** Smoke goes up when the engine is not at operating temperature.

### Black smoke vs blue smoke

Black smoke from a diesel usually points to fuel and air problems, such as injectors, a restricted intake or turbo trouble. Blue smoke usually points to oil being burned. Either one can fail the opacity test. A repair shop can tell you which you have and why.

## How to reduce smoke opacity before the test

1. **Fix known problems first.** Injectors, air filter, turbo and exhaust leaks.
2. **Check the DPF,** if the truck has one. It must be installed, intact and not overdue for cleaning.
3. **Confirm emissions parts are present and connected,** since the visual inspection checks them.
4. **Warm the engine fully** before the test.
5. **Book the test** once the repairs are done.

Our guide on [how to pass the CARB smoke test](/blog/how-to-pass-carb-smoke-test) goes deeper on diesel smoke test preparation.

## What the visual inspection looks at

On older diesels that take the smoke opacity test, the visual inspection is where tampering usually shows up. The tester looks at the emissions-control parts that belong on that engine and checks that they are present, connected and not tampered with. A part that is missing, unplugged or modified fails the truck, no matter how clean the smoke reading is.

That is why "it doesn''t smoke" is not the same as "it will pass." A deleted truck can blow a low reading and still fail.

## Do aftermarket tunes cause problems?

Any tune that disables or hides emissions equipment is tampering, and it fails. If you are unsure whether software on your truck has been changed, ask a qualified repair shop to check it before you book a test.

## If you just bought a truck with a delete

It happens, especially with used trucks. The path forward is the same: have a qualified shop restore the emissions equipment, make sure it works, and then test. Until then, the truck cannot pass Clean Truck Check. If you are unsure what was changed, ask a repair shop to inspect it before you book.

## How Diesel Dynamix helps

We test working, legal trucks on site across Southern California, at your yard, jobsite, terminal, port or home. We run the CARB-verified OBD test or the smoke opacity test plus visual inspection, explain the result in plain English and retest after your shop finishes repairs. We do not do repairs and we do not help with deletes.

- [Smoke opacity testing](/services/smoke-opacity-test)
- [CARB OBD testing](/services/obd-testing)
- [What to do after a failed test](/blog/failed-clean-truck-check-what-to-do)

[Book a test](/book), or call, text or WhatsApp **(858) 342-8328**.', '2026-10-24', true),
  ('clean-truck-check-vs-smog-check', 'Clean Truck Check vs smog check vs PSIP', 'Clean Truck Check vs smog check vs PSIP: which test does your truck need? How CARB''s heavy-duty program differs from regular smog and DOT inspections.', '**Short answer:** Clean Truck Check is not the same as a regular smog check. Clean Truck Check is CARB''s emissions testing program for most diesel and alternative-fuel vehicles over 14,000 lb GVWR that operate in California. Lighter vehicles generally fall under California''s regular Smog Check program instead, which is a separate program with its own rules.

## Clean Truck Check vs smog check: the core difference

People search for a "truck smog check" all the time, and it is easy to see why. Both are emissions tests. But they are different programs.

- **Clean Truck Check** is run by CARB (the California Air Resources Board). It covers most diesel and alternative-fuel vehicles over 14,000 lb GVWR operating in California, including out-of-state and international trucks. Owners report vehicles in CTC-VIS, pay CARB''s annual compliance fee and pass tests on a schedule.
- **California''s regular Smog Check** is a separate program, run through the Bureau of Automotive Repair (BAR), for passenger cars and other lighter vehicles. Check the DMV or BAR for what applies to a vehicle at or under 14,000 lb.

So the difference between CARB and BAR testing comes down to which program covers your vehicle. Weight, fuel type and how the vehicle is used all matter. For edge cases, check CARB''s rules for your vehicle.

## Diesel trucks: 14,000 lb or less vs over

The 14,000 lb GVWR line is the key number.

- **Over 14,000 lb GVWR,** diesel and alternative-fuel: most are covered by Clean Truck Check. That includes semis, box trucks, dump trucks, buses, refuse trucks, construction and agricultural vehicles and motorhomes over 14,000 lb, where they fall under the program.
- **14,000 lb or less:** generally not Clean Truck Check. Check the regular Smog Check rules for your vehicle.

If you drive a heavy pickup or a work truck near the line, look at the GVWR on the door label and check CARB''s rules before you book anything.

## Can a STAR smog station test a truck over 14,000 lb?

A Clean Truck Check test has to be done by a credentialed Clean Truck Check tester using the right equipment, such as a CARB-verified OBD test for 2013 and newer diesel engines. Being a smog station, STAR or otherwise, is a different credential for a different program. If you are thinking about a local smog shop, ask whether it performs Clean Truck Check tests.

## Which Clean Truck Check test does your truck need?

Clean Truck Check itself has different tests depending on the engine:

- **2013 and newer diesel:** CARB-verified OBD test
- **2018 and newer alternative fuel:** CARB-verified OBD test
- **2012 and older diesel without OBD:** smoke opacity test plus visual inspection
- **2017 and older alternative fuel without OBD:** visual inspection

Learn more about the [OBD test](/services/obd-testing) and the [smoke opacity test](/services/smoke-opacity-test).

## Clean Truck Check vs PSIP

PSIP, the Periodic Smoke Inspection Program, was CARB''s older periodic smoke testing requirement for diesel fleets. Clean Truck Check is CARB''s current heavy-duty inspection and maintenance program, and it is the one that drives today''s CTC-VIS reporting, fees and test deadlines. If you have questions about how older PSIP records or requirements apply to your fleet, check CARB.

The practical takeaway: plan your testing around Clean Truck Check and the deadlines in CTC-VIS. Most covered vehicles currently test twice a year, with changes possible. See [how often trucks need testing](/blog/how-often-do-trucks-need-clean-truck-check).

## Clean Truck Check vs DOT and BIT inspections

Clean Truck Check is an emissions program. DOT inspections and California''s BIT inspections are safety programs. They check different things, and passing one does not satisfy the other. If your trucks need both, plan for both.

## Mobile testing vs a test station

A Clean Truck Check test is the same test whether a tester comes to you or you drive to a shop. What changes is the hassle.

- **At a test station,** a driver takes the truck off the road, drives to the shop, waits and drives back.
- **With mobile testing,** the tester comes to your yard, jobsite, terminal, port or home. The truck stays where it is, and one visit can cover a whole fleet.

For many owners, the lost time and fuel of driving to a shop costs more than the test. See [can Clean Truck Check be done at my yard](/blog/can-clean-truck-check-be-done-at-my-yard).

## Common mix-ups to avoid

- **"I passed a smog check, so I''m covered."** A regular smog check does not count for Clean Truck Check, and the reverse is also true.
- **"My truck is registered out of state, so this doesn''t apply."** Out-of-state and international trucks that operate in California are covered.
- **"I paid the fee, so I''m done."** The compliance fee and the tests are separate. A truck needs both, plus a report in CTC-VIS.
- **"I''ll deal with it at renewal."** Non-compliance can lead to a [DMV registration hold](/blog/dmv-registration-hold-clean-truck-check) for California-registered trucks, plus CARB citations and penalties.

## Quick guide: which test do I need?

1. Check the GVWR on the door label.
2. Over 14,000 lb, diesel or alternative fuel, operating in California? You most likely need Clean Truck Check. Report the truck in CTC-VIS; our [CTC-VIS registration guide](/blog/ctc-vis-registration-guide) shows how.
3. At or under 14,000 lb? Check the regular Smog Check rules with the DMV or BAR.
4. Not sure? Check CARB''s rules for your vehicle, or call us and we will help you read them.

## How Diesel Dynamix helps

We are an independent Clean Truck Check testing service, not CARB or a government agency. We test on site anywhere in our Southern California area, from [Los Angeles](/service-areas/los-angeles) and the ports to the [Inland Empire](/service-areas/inland-empire) and [San Diego](/service-areas/san-diego). We help with CTC-VIS questions, explain results in plain English and give you the next due date for every truck.

- [What Clean Truck Check requires](/clean-truck-check)
- [Clean Truck Check FAQ](/clean-truck-check/faq)
- [Our services](/services)

[Book a test](/book), or call, text or WhatsApp **(858) 342-8328**.', '2026-10-24', true),
  ('which-vehicles-need-clean-truck-check', 'Which vehicles need Clean Truck Check? A truck-type guide', 'Which vehicles need Clean Truck Check? Semis, box trucks, dump trucks, buses and motorhomes over 14,000 lb GVWR. See which test yours needs and how to book.', '**Short answer:** Clean Truck Check covers most diesel and alternative-fuel vehicles over 14,000 lb GVWR that operate in California. That includes semis, box trucks, dump trucks, tow trucks, buses and many motorhomes, whether they are registered in California, another state or another country. Your engine model year decides which test you need, not the body style.

## Which vehicles need Clean Truck Check?

The rule is built on two things: weight and fuel. If a vehicle runs on diesel or an alternative fuel, is rated over 14,000 lb gross vehicle weight (GVWR) and operates in California, it is most likely covered.

Body type does not change that. A Class 8 sleeper and a Class 6 delivery truck are in the same program if both are over the weight line. That is why the question "does my truck need it?" almost always comes down to the GVWR on the door label and the fuel the engine burns.

Covered vehicles also include trucks that live outside the state. Out-of-state and international trucks that drive in California are part of the program. See [Clean Truck Check for out-of-state trucks](/blog/clean-truck-check-out-of-state-trucks) for more.

## Truck types we test most often

Here is how common vehicle types line up. In every case the 14,000 lb GVWR rating and the fuel type are what count.

### Semis and tractors

Semi truck emissions tests in California are the bulk of the program. Day cabs, sleepers, heavy haul tractors, car haulers, tankers and reefer trucks are all over 14,000 lb GVWR, so they are covered when they run in California.

### Box trucks, step vans and delivery trucks

Many box trucks need a Clean Truck Check, but not all. A large box truck or reefer used for delivery is usually rated over 14,000 lb. Smaller step vans and cab-overs, such as some Isuzu NPR and Hino models, can fall on either side of the line depending on the build. Check the GVWR on the door label before you decide.

### Dump trucks, roll-offs and construction trucks

Dump trucks, roll-off trucks, concrete mixers, water trucks, crane trucks and bucket trucks are almost always heavy enough to be covered. Construction fleets are part of the program, and we test at jobsites as well as yards.

### Tow trucks and flatbeds

Heavy tow trucks and wreckers are covered. Light-duty tow trucks and flatbeds built on smaller chassis may be under 14,000 lb, so the door label decides.

### Garbage trucks and street sweepers

Refuse trucks, garbage trucks and roll-off haulers are covered. Street sweepers and other special vehicles can have their own rules, so check CARB''s rules for your vehicle before you assume either way.

### Buses

School buses, transit buses, coach buses and larger shuttle buses over 14,000 lb are part of the program. Smaller shuttles built on light chassis may be under the line.

### Medium-duty chassis: F-450, F-550, F-650, Ram 4500/5500, Silverado 6500

These are the trucks people ask about most. A Ford F-650 or Silverado 6500 is usually rated well over 14,000 lb. A Ford F-450, F-550, Ram 4500 or Ram 5500 may be just over or under the line depending on the configuration. The rating on your own door label settles it. Our [pickup guide](/blog/does-my-pickup-need-clean-truck-check) covers this in more detail.

### Motorhomes

Diesel motorhomes over 14,000 lb GVWR can fall under the program. See [Clean Truck Check for motorhomes](/blog/motorhome-clean-truck-check).

### Agricultural and livestock trucks

Agricultural trucks, hay trucks and livestock trucks over 14,000 lb are included in the program where they fall under it. CARB has specific rules for some farm vehicles, so check CARB''s rules or our [exemptions guide](/blog/clean-truck-check-exemptions) before assuming yours is exempt.

### Fire trucks and other special cases

Emergency vehicles, military vehicles and other special categories have their own treatment under CARB''s rules. We don''t guess on these. Check CARB''s rules for your vehicle or look it up in CTC-VIS.

## Which test does each vehicle need?

The test depends on engine type and model year, not on whether it is a bus, a dump truck or a semi.

- **2013 and newer diesel engines:** CARB-verified OBD test. See [OBD testing](/services/obd-testing).
- **2012 and older diesel engines without OBD:** smoke opacity test plus a visual inspection. See [smoke opacity testing](/services/smoke-opacity-test).
- **2018 and newer alternative-fuel engines:** CARB-verified OBD test.
- **2017 and older alternative-fuel engines without OBD:** visual inspection.

So a 2015 dump truck and a 2015 sleeper get the same OBD test, while a 2010 box truck gets a smoke test and visual inspection.

## How to check if your vehicle needs Clean Truck Check

1. **Find the GVWR.** It is printed on the label on the driver''s door or door jamb. If it reads over 14,000 lb, keep going.
2. **Confirm the fuel.** Diesel and alternative-fuel engines are covered.
3. **Ask if it runs in California.** Registration state does not matter. Operating in California does.
4. **Look it up in CTC-VIS.** CARB''s CTC-VIS system is where owners report vehicles, pay the annual compliance fee and see deadlines. Our [CTC-VIS registration guide](/blog/ctc-vis-registration-guide) walks through it.
5. **Check edge cases with CARB.** If you think your vehicle might be exempt, confirm it with CARB''s rules before you skip a test.

Most covered vehicles currently test twice a year. Missing a deadline can lead to a DMV registration hold for California-registered vehicles, plus CARB citations and penalties.

## How Diesel Dynamix helps

Diesel Dynamix is an independent mobile testing service in Southern California. We are not CARB. We come to your yard, jobsite, terminal, port or home and run the right test for each vehicle, whether it is one tow truck or a mixed fleet of semis, buses and dump trucks.

- We explain results in plain English and give you the next due date.
- We help with CTC-VIS questions.
- Fleets get per-truck pricing, recurring visits, early-morning visits, reminders and records per VIN. See [fleet testing](/services/fleet-testing).

We cover Los Angeles, Long Beach, Orange County, the Inland Empire, San Diego and El Centro. See our [service areas](/service-areas), then [book a test](/book) or call or text (858) 342-8328.', '2026-10-24', true),
  ('does-my-pickup-need-clean-truck-check', 'Does my F-350 need Clean Truck Check? The GVWR rule', 'Does my F-350 need Clean Truck Check? Most pickups are under 14,000 lb GVWR and not covered. Here is how to check yours and when heavy-duty pickups qualify.', '**Short answer:** Clean Truck Check only covers vehicles rated over 14,000 lb GVWR, so most pickups, including most F-350, Ram 3500 and Silverado 3500 diesels, are not covered. Heavy-duty pickups and chassis cabs rated over 14,000 lb may be. The GVWR on your door label decides, and CARB has the final word on edge cases.

## Does my F-350 need Clean Truck Check?

Usually not. Clean Truck Check is CARB''s program for heavy-duty vehicles, and it applies to diesel and alternative-fuel vehicles over 14,000 lb gross vehicle weight rating (GVWR) that operate in California. Most pickups are rated below that.

The key word is **rating**. GVWR is the maximum loaded weight the manufacturer rates the truck for. It is not what the truck weighs empty, and it is not how much you happen to be hauling today. A pickup does not become covered because you load it heavy or pull a big trailer. It is covered only if its rated GVWR is over 14,000 lb.

## Where to find GVWR on your truck

Open the driver''s door and look at the label on the door or door jamb. The GVWR is printed there, usually in pounds and kilograms. You may also see GCWR (gross combined weight rating) on some paperwork. GCWR includes a trailer, and it is not the number Clean Truck Check uses.

1. Open the driver''s door.
2. Find the label on the door edge or door jamb.
3. Read the GVWR value in pounds.
4. If it is 14,000 lb or less, your truck is not in Clean Truck Check.
5. If it is over 14,000 lb, your truck is likely covered. Confirm in CARB''s CTC-VIS system.

If the label is missing or damaged, check your registration paperwork or ask the dealer. If you are still unsure, check CARB''s rules for your vehicle.

## 3/4-ton and one-ton diesel pickups

**3/4-ton diesels** like the F-250, Ram 2500 and Silverado 2500 are well below the 14,000 lb line, so they are not part of Clean Truck Check.

**One-ton diesels** like the F-350, Ram 3500 and Silverado 3500, including duallys, are still rated below 14,000 lb in most configurations. Read your own door label rather than relying on a general rule, because configurations vary.

## F-450, F-550, Ram 4500 and 5500, and hotshot trucks

This is where pickups and Clean Truck Check start to overlap. Heavier models such as the F-450, F-550, Ram 4500 and Ram 5500 come in many configurations, and some are rated over 14,000 lb. Many hotshot trucks are built on these chassis.

- If your hotshot F-450 or F-550 shows a GVWR over 14,000 lb, it is likely covered and needs testing on CARB''s schedule.
- If it shows 14,000 lb or less, it is not in Clean Truck Check.
- If you have questions about a re-rated or modified truck, check CARB''s rules for your vehicle. We won''t guess on weight edge cases, and neither should you.

## Smog check or Clean Truck Check for my diesel pickup?

They are different programs. Clean Truck Check is CARB''s heavy-duty program for vehicles over 14,000 lb GVWR. A diesel pickup under that rating is outside Clean Truck Check. Whether it needs a regular smog check is a separate question for the DMV, not something Clean Truck Check decides. Our post on [Clean Truck Check vs smog check](/blog/clean-truck-check-vs-smog-check) explains the difference.

## If your pickup is covered: which test it needs

If your heavy-duty pickup or chassis cab is over 14,000 lb GVWR, the test is based on engine type and model year:

- **2013 and newer diesel:** CARB-verified [OBD test](/services/obd-testing).
- **2012 and older diesel without OBD:** [smoke opacity test](/services/smoke-opacity-test) plus a visual inspection.
- **2018 and newer alternative fuel:** CARB-verified OBD test.
- **2017 and older alternative fuel without OBD:** visual inspection.

Covered vehicles are reported in CTC-VIS, where the owner pays CARB''s annual compliance fee per vehicle. Most covered vehicles currently test twice a year. Under CARB''s original rule, OBD-equipped vehicles move to four tests a year from October 1, 2027, though a bill has proposed cutting testing to once a year. Check your own deadlines in CTC-VIS.

## Pickups in a work fleet

Many Southern California fleets mix pickups with heavier trucks. A contractor might run F-250s and F-350s alongside an F-550 dump body and a few semis. In that case, sort the fleet by GVWR first. Pickups at or under 14,000 lb stay off your Clean Truck Check list. Chassis cabs and heavier trucks over the line go on it, get reported in CTC-VIS and follow CARB''s testing schedule. Keeping that list accurate per VIN is the easiest way to avoid paying for tests you don''t need, or missing ones you do.

## Practical steps for pickup owners

1. Read the GVWR on your door label today.
2. If it is over 14,000 lb, look the truck up in CTC-VIS and check your deadline. Our [CTC-VIS registration guide](/blog/ctc-vis-registration-guide) can help.
3. Make sure the check engine light is off and emissions faults are fixed before testing. See [readiness monitors and the check engine light](/blog/readiness-monitors-check-engine-light-clean-truck-check).
4. Book your test before the deadline. A missed deadline can lead to a DMV registration hold for California-registered vehicles, plus CARB citations and penalties.

## How Diesel Dynamix helps

Diesel Dynamix is an independent mobile testing service, not CARB. If your heavy-duty pickup or hotshot truck is covered, we come to you: your home, yard or jobsite anywhere we serve in Southern California, from [Los Angeles](/service-areas/los-angeles) and [Orange County](/service-areas/orange-county) to the [Inland Empire](/service-areas/inland-empire) and [San Diego](/service-areas/san-diego).

We explain your result in plain English, give you the next due date and can send reminders. Not sure if your truck is covered? Call or text (858) 342-8328 with the GVWR from your door label and we''ll help you think it through, or [book a test](/book).', '2026-10-24', true),
  ('motorhome-clean-truck-check', 'Motorhome Clean Truck Check: RVs over 14,000 lb', 'Motorhome Clean Truck Check explained: which diesel RVs over 14,000 lb GVWR are covered, which test they need, and how we test at your home or storage lot.', '**Short answer:** Diesel and alternative-fuel motorhomes over 14,000 lb GVWR can fall under California''s Clean Truck Check program, including many Class A diesel pushers and larger Super C motorhomes. Whether your specific RV is covered is CARB''s call, so check CARB''s rules or CTC-VIS for your vehicle. If it is covered, a mobile tester can test it where it is parked.

## Does my diesel motorhome need Clean Truck Check?

It might. Clean Truck Check covers most diesel and alternative-fuel vehicles over 14,000 lb gross vehicle weight rating (GVWR) that operate in California, and motorhomes over that rating can be included where they fall under the program.

Two questions get you most of the way:

1. **Is the GVWR over 14,000 lb?** Look at the weight label on the driver''s side, usually on the door, door jamb or near the driver''s seat. Many Class A diesel pushers and big Super C coaches are over the line. Smaller Class C and Class B motorhomes usually are not.
2. **Is the engine diesel or alternative fuel?** Clean Truck Check is built around diesel and alternative-fuel engines.

If both answers are yes, look the motorhome up in CARB''s CTC-VIS system and check CARB''s rules for your vehicle. That is where you will see whether it must be reported, tested and paid for.

## Are RVs exempt from Clean Truck Check?

Not as a blanket rule. Being a motorhome rather than a work truck does not on its own take a vehicle out of the program. CARB''s rules decide whether a particular RV is covered or has special treatment. We don''t guess on that, and we recommend you don''t either. Check CARB''s rules, CTC-VIS, or our [exemptions guide](/blog/clean-truck-check-exemptions) for what to ask.

## Which test does a motorhome need?

The test depends on the engine, not on the coach. It is the same as for any other heavy-duty vehicle:

- **2013 and newer diesel engines:** CARB-verified [OBD test](/services/obd-testing). The tester connects to the vehicle''s diagnostic system and checks for emissions faults and readiness.
- **2012 and older diesel engines without OBD:** [smoke opacity test](/services/smoke-opacity-test) plus a visual inspection.
- **2018 and newer alternative-fuel engines:** CARB-verified OBD test.
- **2017 and older alternative-fuel engines without OBD:** visual inspection.

Use the engine model year, which can differ from the year the coach was finished.

### OBD test or smoke test for my motorhome?

If your diesel pusher has a 2013 or newer engine, expect an OBD test. An older diesel without OBD gets the opacity test and visual inspection. RV OBD testing works just like truck OBD testing.

## Out-of-state motorhomes in California

Registration state does not decide coverage. Clean Truck Check applies to covered vehicles that operate in California, including out-of-state and international vehicles. If you winter in Southern California or travel through the state in a big diesel coach, check CARB''s rules for your vehicle and look it up in CTC-VIS. Our post on [out-of-state trucks](/blog/clean-truck-check-out-of-state-trucks) explains how this works for non-California registrations.

## Motorhome CTC-VIS registration

Covered vehicles are reported in CARB''s CTC-VIS system. The owner pays CARB''s annual compliance fee per vehicle there. The amount is set by CARB and shown in CTC-VIS. You can also see your deadlines there. Our [CTC-VIS registration guide](/blog/ctc-vis-registration-guide) walks through account setup.

Most covered vehicles currently test twice a year. Under CARB''s original rule, OBD-equipped vehicles move to four tests a year from October 1, 2027, and a bill has proposed cutting testing to once a year, so check CTC-VIS for your own schedule.

For California-registered vehicles, missing a deadline can lead to a DMV registration hold. CARB can also issue citations and penalties.

## Getting ready for a motorhome test

1. **Confirm GVWR and engine year.** Note them before you book.
2. **Check the dash.** A check engine light on, or readiness monitors not set, can cause an OBD test to fail. See [readiness monitors and the check engine light](/blog/readiness-monitors-check-engine-light-clean-truck-check).
3. **Fix known emissions faults first.** DPF and emissions faults are common reasons for a fail. Deleted or tampered emissions equipment fails and is illegal.
4. **Pick a spot.** The coach needs to be somewhere the tester can reach it and run the engine.
5. **Have your CTC-VIS details handy.** It speeds up the visit.

If the motorhome fails, it needs repair and then a retest. We don''t do repairs, but we explain what the result means so your mechanic knows where to start. See [what to do after a failed test](/blog/failed-clean-truck-check-what-to-do).

## What happens during a mobile motorhome test

The visit is simple. The tester confirms the vehicle and VIN, then runs the test that fits the engine. For an OBD test, that means connecting to the diagnostic system with CARB-verified equipment while you stay with your coach. For an older diesel, it means a smoke opacity test plus a visual inspection, so the engine needs to run. Once it''s done, you get the result in plain English and your next due date. If you''d like, we''ll send a reminder before the next one.

## Mobile motorhome testing in Southern California

Driving a 40-foot coach to a test site is a hassle. Diesel Dynamix tests on site. We come to your home, and if your RV is at a storage lot or RV park, ask us about testing there when you book. We serve the Inland Empire, San Diego, Los Angeles, Orange County, Long Beach and El Centro, including [Riverside](/service-areas/riverside), [San Bernardino](/service-areas/san-bernardino) and [San Diego](/service-areas/san-diego).

## How Diesel Dynamix helps

Diesel Dynamix is an independent mobile testing service, not CARB or a government agency. For motorhome owners we:

- Run the right test for your engine where your coach is parked.
- Explain the result in plain English and give you the next due date.
- Help with CTC-VIS questions and send reminders.

Call or text (858) 342-8328, message us on WhatsApp, or [book a test](/book).', '2026-10-24', true),
  ('obd-test-by-truck-brand', 'Freightliner OBD test and other brands: CARB guide', 'Freightliner OBD test, plus Peterbilt, Kenworth, International, Volvo and Mack: which trucks get the CARB OBD test, which get a smoke test and how to prepare.', '**Short answer:** A Freightliner OBD test works the same way as a Peterbilt, Kenworth, International, Volvo or Mack OBD test. CARB decides the test by engine model year, not by brand: 2013 and newer diesel engines get a CARB-verified OBD test, and 2012 and older diesels without OBD get a smoke opacity test plus a visual inspection.

## Does the truck brand change the Clean Truck Check?

No. Clean Truck Check is built around the engine, not the badge on the hood. A 2019 Freightliner Cascadia, a 2019 Peterbilt 579 and a 2019 Volvo VNL all get the same CARB-verified OBD test. A 2010 Kenworth T800 and a 2010 Mack Granite with non-OBD engines both get a smoke opacity test and visual inspection.

The rule for diesel trucks over 14,000 lb GVWR:

- **2013 and newer diesel engines:** CARB-verified [OBD test](/services/obd-testing).
- **2012 and older diesel engines without OBD:** [smoke opacity test](/services/smoke-opacity-test) plus a visual inspection.

For alternative-fuel trucks, such as natural gas models, it is 2018 and newer for the OBD test and a visual inspection for 2017 and older engines without OBD.

Go by the **engine** model year, not the year on the title. If you are not sure, the engine''s emission label or your dealer can tell you, and CTC-VIS shows the vehicle record.

## Brand by brand

Below is how the common Southern California fleet trucks line up. The test method is the same across brands; what changes is the model year of the engine in your truck.

### Freightliner (Cascadia, M2)

Freightliner Cascadia and M2 trucks with 2013 or newer diesel engines get the Freightliner OBD test like any other OBD truck. Older Freightliners with non-OBD engines get the smoke opacity test and visual inspection. Whatever engine is under the hood, the test is chosen by engine year.

### Peterbilt (579, 389)

A Peterbilt 579 or 389 with a 2013 or newer diesel gets the CARB OBD test. That applies whatever engine the truck has. Older 389s and earlier models with pre-2013 non-OBD engines get the smoke test.

### Kenworth (T680, T880)

Kenworth T680 and T880 trucks with 2013 or newer engines get the OBD test. Kenworth owners often ask about DPF regens and readiness monitors before the test; more on that below.

### International (LT, ProStar)

International LT trucks and ProStars with 2013 or newer diesels get the OBD test. Older Internationals, including trucks with earlier MaxxForce engines, are tested by engine model year like everything else: OBD if the engine is 2013 or newer, smoke and visual if it is older without OBD.

### Volvo (VNL)

Volvo VNL trucks, including those with Volvo D13 engines, get the OBD test when the engine is 2013 or newer.

### Mack (Anthem, Granite)

Mack Anthem and Granite trucks with 2013 or newer engines, including the Mack MP8, get the OBD test. Older Granites with non-OBD engines get the opacity test and visual inspection.

### Western Star, Hino, Isuzu and others

The same rule applies to Western Star, Hino, Isuzu and every other make that is over 14,000 lb GVWR. The brand does not create a different test.

## Engines: Cummins, Detroit, PACCAR and older models

Cummins ISX and X15, Detroit DD15 and PACCAR MX-13 trucks all test the same way when the engine is 2013 or newer: a CARB-verified OBD test. Older engine families, such as the Detroit Series 60, Cummins N14 and Caterpillar C15, generally show up in older trucks. If the engine is 2012 or older without OBD, it gets the smoke opacity test and visual inspection. Always confirm with the engine''s actual model year.

## OBD port and connector questions

The tester connects to the truck''s diagnostic port to read data. Port location and connector type vary by make, model and year, and older and newer trucks can use different connectors, such as 9-pin and 16-pin. You do not need to find the port for us. When you book, tell us the make, model, engine and year so we arrive ready for your truck.

If a truck will not communicate with the tester, the test can''t be completed. That is a sign of a wiring, connector or module problem that needs a mechanic.

## Readiness monitors, check engine lights and regens

Most OBD fails have nothing to do with the brand. The common causes are the same for a Cascadia or a T680:

- **Check engine light (MIL) on.** Active emissions faults can fail the test.
- **Readiness monitors not set.** Clearing codes or disconnecting the battery can leave monitors not set, and the truck then needs normal driving before they are ready again.
- **DPF or other emissions faults.** If your truck is showing DPF warnings, get them fixed before you test.
- **Tampered or deleted equipment.** Deleted or tampered systems fail and are illegal.

On Kenworth DPF regens or a Freightliner drive cycle, follow the manufacturer''s guidance or your mechanic''s advice. We don''t do repairs. Our guides on [readiness monitors and the check engine light](/blog/readiness-monitors-check-engine-light-clean-truck-check) and [DPF deletes and smoke](/blog/dpf-deletes-and-smoke-clean-truck-check) go deeper.

## Practical steps before your OBD test

1. Confirm the engine model year so you know which test applies.
2. Check that the check engine light is off.
3. Don''t clear codes or disconnect the battery right before the test.
4. Get open emissions faults repaired first.
5. Check your deadline in CTC-VIS. Most covered trucks currently test twice a year, and under CARB''s original rule OBD trucks move to four tests a year from October 1, 2027.

## How Diesel Dynamix helps

Diesel Dynamix is an independent mobile tester, not CARB. Mixed fleets of Freightliners, Peterbilts, Kenworths, Internationals, Volvos and Macks are what we see every day across Southern California. We test them at your yard, terminal or the [Port of Long Beach](/service-areas/ports/port-of-long-beach) and [Port of Los Angeles](/service-areas/ports/port-of-los-angeles), explain any failure in plain English and keep records per VIN.

Fleets get per-truck pricing, recurring visits and reminders through [fleet testing](/services/fleet-testing). Call or text (858) 342-8328 or [book a test](/book).', '2026-10-24', true),
  ('clean-truck-check-en-espanol', 'Clean Truck Check en español: prueba de emisiones móvil', 'Prueba de emisiones para camiones en California: qué es el Clean Truck Check, qué prueba necesita su camión y cómo hacerla en su yarda. Le explicamos todo.', '**Respuesta corta:** el Clean Truck Check es el programa de CARB que exige pruebas de emisiones periódicas a la mayoría de los camiones diésel y de combustible alternativo de más de 14,000 libras GVWR que circulan en California. Los camiones 2013 y más nuevos hacen una prueba OBD, y los diésel 2012 y más viejos sin OBD hacen una prueba de humo (opacidad) con inspección visual. Diesel Dynamix hace la prueba de emisiones para camiones en su yarda, en el sur de California.

## ¿Qué es el Clean Truck Check?

Es el programa de inspección para vehículos pesados de CARB (California Air Resources Board). Mucha gente lo llama "el smog para camiones diésel", pero no es el mismo smog check de los carros. Es un programa aparte, con sus propias reglas, para vehículos de trabajo pesados.

El programa cubre a la mayoría de los vehículos diésel y de combustible alternativo de más de 14,000 libras de peso bruto vehicular (GVWR) que operan en California. Eso incluye tractocamiones, camiones de caja, camiones de volteo, grúas, autobuses, camiones de basura, camiones de construcción y agrícolas, y casas rodantes de más de 14,000 libras cuando entran en el programa. Si tiene dudas sobre un caso especial, revise las reglas de CARB para su vehículo.

## Requisitos del Clean Truck Check

Los requisitos principales son tres:

1. **Registrar cada camión en CTC-VIS.** Es el sistema de CARB donde el dueño reporta sus vehículos.
2. **Pagar la cuota anual de cumplimiento.** CARB cobra una cuota por cada vehículo cada año. El monto lo fija CARB y aparece en CTC-VIS.
3. **Pasar la prueba de emisiones a tiempo.** Cada camión tiene su fecha límite en CTC-VIS.

## ¿Qué prueba necesita mi camión?

Depende del tipo de motor y del año del motor:

- **Diésel 2013 y más nuevos:** prueba OBD verificada por CARB. El técnico se conecta al sistema de diagnóstico del camión.
- **Diésel 2012 y más viejos sin OBD:** prueba de humo (prueba de opacidad) más una inspección visual.
- **Combustible alternativo 2018 y más nuevos:** prueba OBD verificada por CARB.
- **Combustible alternativo 2017 y más viejos sin OBD:** inspección visual.

Más detalles en inglés: [prueba OBD](/services/obd-testing) y [prueba de opacidad](/services/smoke-opacity-test).

## ¿Cada cuánto es el Clean Truck Check?

Hoy, la mayoría de los vehículos cubiertos hacen la prueba **dos veces al año**. Según la regla original de CARB, los vehículos con OBD pasarían a **cuatro pruebas al año a partir del 1 de octubre de 2027**. Hay una propuesta de ley para bajarlo a una vez al año, así que esto puede cambiar. Su fecha límite exacta siempre aparece en CTC-VIS.

## ¿Cuánto cuesta el Clean Truck Check?

Hay dos costos diferentes:

- **La cuota anual de CARB**, por vehículo, que se paga en CTC-VIS.
- **El costo de la prueba**, que lo cobra el técnico que hace la prueba.

Nuestro precio depende de cuántos camiones son, del tipo de prueba y de la ubicación. Para flotillas damos precio por camión. Pida su cotización por teléfono o WhatsApp al (858) 342-8328.

## Camiones de otro estado y camiones mexicanos

Sí aplica. El Clean Truck Check cubre a los camiones que circulan en California, sin importar dónde estén registrados. Eso incluye camiones de otros estados y camiones de México. Si usted cruza por Otay Mesa o Calexico, o entra a los puertos, su camión necesita estar al corriente. Más información en inglés: [camiones de otro estado](/blog/clean-truck-check-out-of-state-trucks).

## Multas y DMV hold de CARB

Si no cumple, hay consecuencias:

- **DMV hold:** para camiones registrados en California, el DMV puede bloquear la renovación del registro hasta que el camión esté en cumplimiento.
- **Multas y citaciones de CARB:** CARB puede poner citaciones y multas.

Si ya se le pasó la fecha límite, no espere más. Lea [qué hacer si se le pasó la fecha](/blog/missed-clean-truck-check-deadline) (en inglés).

## Si su camión falló la prueba de humo o la prueba OBD

Si su camión falló, necesita una reparación y luego una nueva prueba. Las causas más comunes son:

- La luz de check engine prendida.
- Monitores de preparación (readiness monitors) que no están listos.
- Fallas del DPF o del sistema de emisiones.
- Equipo de emisiones alterado o quitado (delete).

Nosotros no hacemos reparaciones. Hacemos la prueba y le explicamos el resultado en palabras sencillas para que su mecánico sepa por dónde empezar. Tampoco ayudamos con deletes del DPF: un sistema quitado o alterado no pasa y es ilegal.

## Cómo registrar su camión en CTC-VIS

El registro en CTC-VIS lo hace el dueño del vehículo en el sistema de CARB. Ahí reporta cada camión, paga la cuota anual y ve sus fechas límite. Si se le complica, nosotros le ayudamos con sus preguntas sobre CTC-VIS. Tenemos una [guía de registro en CTC-VIS](/blog/ctc-vis-registration-guide) en inglés.

## Pasos prácticos para troqueros

1. Revise el GVWR en la etiqueta de la puerta del chofer. Si es de más de 14,000 libras, probablemente su camión está cubierto.
2. Confirme el año del motor para saber qué prueba le toca.
3. Entre a CTC-VIS y revise su fecha límite.
4. Asegúrese de que la luz de check engine esté apagada y de que no haya fallas de emisiones.
5. Agende su prueba antes de la fecha límite.

## Cómo le ayuda Diesel Dynamix

Diesel Dynamix es un servicio independiente de pruebas móviles. No somos CARB ni una agencia del gobierno. Hacemos la prueba de emisiones a domicilio: vamos a su yarda, obra, terminal, puerto o casa. No tiene que manejar a ningún lado.

- Le explicamos el resultado en palabras sencillas y le damos su próxima fecha.
- Le ayudamos con preguntas de CTC-VIS y le mandamos recordatorios.
- Para flotillas: precio por camión, visitas programadas, visitas temprano en la mañana y registros por VIN. Vea [pruebas para flotillas](/services/fleet-testing).

Damos servicio en Los Ángeles, Long Beach y el [Puerto de Long Beach](/service-areas/ports/port-of-long-beach), el Condado de Orange, el Inland Empire, Riverside, San Bernardino, Ontario, Fontana, San Diego y El Centro en el Valle Imperial. Vea nuestras [áreas de servicio](/service-areas).

Llame o mande texto al (858) 342-8328, escríbanos por WhatsApp o [agende en línea](/book).', '2026-10-24', true),
  ('clean-truck-check-2026-2027-deadlines', 'Clean Truck Check 2027 quarterly testing and deadlines', 'Clean Truck Check 2027 quarterly testing: what CARB''s rule says, how your 2026 deadlines work, what may still change and how to plan your fleet''s tests now.', '**Short answer:** Most trucks covered by Clean Truck Check currently test twice a year. Under CARB''s original rule, OBD-equipped vehicles move to four tests a year (quarterly testing) starting October 1, 2027. A bill has proposed cutting testing to once a year, so the schedule may change; your own deadlines are always in CARB''s CTC-VIS system.

## Where Clean Truck Check stands in late 2026

Clean Truck Check is CARB''s heavy-duty inspection and maintenance program, often called HD I/M. It covers most diesel and alternative-fuel vehicles over 14,000 lb GVWR that operate in California, including out-of-state and international trucks.

Today, the picture for most owners is:

- Each vehicle is reported in CTC-VIS and the owner pays CARB''s annual compliance fee per vehicle.
- Most covered vehicles test **twice a year**.
- Each vehicle has its own deadlines, shown in CTC-VIS.
- Missing a deadline can lead to a DMV registration hold for California-registered vehicles, plus CARB citations and penalties.

## When is my Clean Truck Check due in 2026?

Your deadline is specific to your vehicle, and the only reliable place to see it is CTC-VIS. Log in, find the vehicle by VIN and look at the next compliance deadline.

People often ask whether the deadline is tied to the DMV registration month, and how the testing window works. CARB sets those details, and how they apply can depend on the vehicle and its registration. We don''t want you to plan around a guess, so check the deadline and window shown for your vehicle in CTC-VIS, or check CARB''s rules. If you want a second pair of eyes, we can help you read what CTC-VIS shows.

## Clean Truck Check 2027: quarterly testing for OBD trucks

Under CARB''s original rule, OBD-equipped vehicles move from twice-a-year testing to **four tests a year from October 1, 2027**. That affects:

- 2013 and newer diesel engines, which use the CARB-verified OBD test.
- 2018 and newer alternative-fuel engines, which also use the OBD test.

For a fleet, quarterly testing roughly doubles the number of OBD tests per truck each year. That means more scheduling, more chances to miss a deadline and more value in keeping trucks fault-free between tests.

Non-OBD vehicles (2012 and older diesels getting a smoke opacity test and visual inspection, and 2017 and older alternative-fuel engines getting a visual inspection) are not part of that OBD change. Check CTC-VIS for their schedule.

## What might change: the once-a-year bill

A bill has proposed cutting Clean Truck Check testing to once a year. If it passes, the October 2027 quarterly schedule and today''s twice-a-year schedule could change. Until something is final, plan on the rule as it stands and watch CARB updates and CTC-VIS.

We won''t predict how it turns out. What we can say is that owners who keep testing on time under the current rule are not hurt by any change. Owners who wait for a change and miss a deadline can end up with a registration hold.

## How to plan your 2026-2027 testing now

You don''t need to wait for January 2027 or for the bill to settle. A few steps make the next year easier:

1. **List every covered vehicle.** Include out-of-state units that run in California.
2. **Pull each deadline from CTC-VIS.** Put them in one calendar.
3. **Group trucks by deadline.** One visit can cover several trucks due around the same time.
4. **Pay the annual compliance fee for each vehicle.** The fee is separate from the testing fee. See [the compliance fee explained](/blog/clean-truck-check-compliance-fee-explained).
5. **Keep trucks ready to pass.** Fix check engine lights, readiness monitor issues and DPF faults between tests. See [readiness monitors and the check engine light](/blog/readiness-monitors-check-engine-light-clean-truck-check).
6. **Set up recurring testing.** If quarterly testing takes effect, a standing schedule is easier than booking truck by truck.
7. **Plan for retests.** A failed truck needs repair and a retest before the deadline. See [what to do after a failed test](/blog/failed-clean-truck-check-what-to-do).

## What a missed deadline costs you

Deadlines matter more as testing gets more frequent. For California-registered vehicles, a missed Clean Truck Check deadline can lead to a DMV registration hold. CARB can also issue citations and penalties. Out-of-state and international trucks are covered too when they operate in California, so their deadlines matter just as much. If a deadline has already passed, test as soon as you can. See [missed Clean Truck Check deadline](/blog/missed-clean-truck-check-deadline) and [DMV registration holds](/blog/dmv-registration-hold-clean-truck-check).

## How early can I test before my deadline?

CARB sets when a test counts toward a deadline. Check the testing window shown for your vehicle in CTC-VIS or in CARB''s rules before you book far ahead. If you are close to a deadline, book now; there is little upside in waiting.

## How Diesel Dynamix helps

Diesel Dynamix is an independent mobile testing service in Southern California, not CARB. As testing gets more frequent, the time lost driving trucks to a test site adds up. We test at your yard, terminal, jobsite or port, so trucks stay close to work.

- We give you the next due date after each test and can send reminders.
- Fleets get recurring visits, early-morning visits, per-truck pricing and records per VIN. See [fleet testing](/services/fleet-testing).
- We help with CTC-VIS questions and explain results in plain English.

For background on frequency, read [how often trucks need Clean Truck Check](/blog/how-often-do-trucks-need-clean-truck-check). To get on a schedule, call or text (858) 342-8328 or [book a test](/book).', '2026-10-24', true),
  ('clean-truck-check-exemptions', 'Clean Truck Check exemptions list: is your truck exempt?', 'Clean Truck Check exemptions list: which vehicles fall outside the program, which cases CARB decides, and how to confirm your truck''s status before you skip.', '**Short answer:** The clearest way a vehicle falls outside Clean Truck Check is being rated 14,000 lb GVWR or less. Beyond that, exemptions for new trucks, zero-emission trucks, agricultural vehicles, emergency vehicles and non-operational trucks are set by CARB, and the details matter. Before you skip a test, confirm your vehicle''s status in CTC-VIS or CARB''s rules.

## Why exemptions need a careful look

Clean Truck Check covers most diesel and alternative-fuel vehicles over 14,000 lb GVWR that operate in California. That includes out-of-state and international trucks, plus buses, refuse trucks, construction trucks, agricultural trucks and motorhomes over 14,000 lb where they fall under the program.

Exemptions are CARB''s decision, not ours, and the rules can be specific about conditions, timing and paperwork. Getting it wrong can mean a missed deadline. For California-registered vehicles that can lead to a DMV registration hold, and CARB can issue citations and penalties. So this guide tells you what to ask and where to check, rather than guessing for you.

## Is my truck exempt from Clean Truck Check?

Start with these questions:

1. **Is the GVWR 14,000 lb or less?** If so, it is not in Clean Truck Check. Check the label on the driver''s door or door jamb.
2. **Is it diesel or alternative fuel?** The program is built around these engines.
3. **Does it operate in California?** Registration state does not matter.
4. **Does it fit a special category?** If you think it does, confirm with CARB before you skip anything.

If the first three answers point to "covered", treat the truck as covered until CARB or CTC-VIS shows otherwise.

## Common exemption questions

### New trucks: how long are they exempt?

Owners often hear that new trucks get a break for their first few model years. CARB sets whether and how that applies and when the first test is due. Look up the vehicle in CTC-VIS for its first deadline, or check CARB''s rules. Don''t assume a new truck has no deadline.

### Zero-emission and electric trucks

Electric and other zero-emission trucks don''t burn diesel or alternative fuel, and owners often ask whether they still have to register in CTC-VIS. CARB decides what reporting applies. Check CARB''s rules or CTC-VIS for your vehicle.

### Agricultural and farm vehicles

Agricultural trucks over 14,000 lb are included in the program where they fall under it. Being a farm truck alone does not make a vehicle exempt. CARB has specific rules for some agricultural vehicles, so check CARB''s rules for your truck.

### Emergency and military vehicles

Fire trucks, other emergency vehicles and military vehicles have their own treatment under CARB''s rules. If you run one of these, check CARB''s rules for your vehicle.

### Two-engine street sweepers and special equipment

Some vehicles, like street sweepers with an auxiliary engine, raise questions about which engine is tested. CARB''s rules address special vehicles. Check them for your equipment.

### Off-road vehicles

Clean Truck Check is about vehicles that operate on California roads. If your equipment is truly off-road, CARB''s rules will say whether it falls under this program. Check before you skip testing on anything that is registered for road use.

### Non-operational (PNO) trucks and trucks not driven in California

If a truck is on Planned Non-Operation (PNO) status with the DMV, or it doesn''t operate in California, owners ask whether testing still applies. CARB sets how these cases are handled in CTC-VIS. Check CARB''s rules and update the vehicle''s information in CTC-VIS. Our [CTC-VIS registration guide](/blog/ctc-vis-registration-guide) explains how to manage vehicle records.

### Low-use and seasonal trucks

Low mileage or seasonal use does not by itself make a truck exempt. If CARB has a provision that fits your situation, it will be in CARB''s rules. Until you confirm one applies, keep the truck on schedule.

## Exemption myths to avoid

A few assumptions cause problems every year:

- **"My truck is registered out of state, so it''s exempt."** Not true. Out-of-state and international trucks that operate in California are covered.
- **"It''s a motorhome, not a work truck."** Motorhomes over 14,000 lb can fall under the program. See [Clean Truck Check for motorhomes](/blog/motorhome-clean-truck-check).
- **"It passed last time, so I''m set."** Covered vehicles test on a recurring schedule, not once.
- **"I paid the fee, so I don''t need a test."** The annual compliance fee and the test are separate requirements.

## What to do if you think your truck is exempt

1. **Read the GVWR.** If it''s 14,000 lb or less, you''re outside the program.
2. **Look the vehicle up in CTC-VIS.** Check its status and deadlines.
3. **Check CARB''s rules** for the category you think applies.
4. **Keep records** of what you found and any exemption you claim.
5. **If you''re unsure, test.** A passed test keeps you compliant while you sort out the question.

## If your truck is not exempt

Then it needs the test for its engine:

- **2013 and newer diesel:** CARB-verified [OBD test](/services/obd-testing).
- **2012 and older diesel without OBD:** [smoke opacity test](/services/smoke-opacity-test) plus a visual inspection.
- **2018 and newer alternative fuel:** CARB-verified OBD test.
- **2017 and older alternative fuel without OBD:** visual inspection.

Most covered vehicles currently test twice a year. Under CARB''s original rule, OBD-equipped vehicles move to four tests a year from October 1, 2027, and a bill has proposed cutting testing to once a year. See [2026-2027 deadlines](/blog/clean-truck-check-2026-2027-deadlines).

## How Diesel Dynamix helps

Diesel Dynamix is an independent mobile testing service, not CARB, so we don''t grant or decide exemptions. What we do is test covered vehicles at your yard, jobsite, terminal, port or home across Southern California, explain results in plain English and give you the next due date. We can also walk through what CTC-VIS shows for your vehicles.

For more on who''s covered, see [which vehicles need Clean Truck Check](/blog/which-vehicles-need-clean-truck-check) and our [Clean Truck Check FAQ](/clean-truck-check/faq). Call or text (858) 342-8328 or [book a test](/book).', '2026-10-24', true)
on conflict (slug) do nothing;
