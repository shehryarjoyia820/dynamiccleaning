-- One proposal and one follow-up per priority tier, written for that fleet size.
-- Staff can edit them freely; existing copies are never overwritten.

insert into public.email_templates (id, name, kind, subject, body) values
  ('6f1b2a10-0000-4000-8000-000000000101',
   'P1 proposal · Owner-operators (1 truck)',
   'proposal',
   '{{first_name}}, Clean Truck Check without losing a day of work',
   E'Hi {{first_name}},\n\nAs an owner-operator, every hour your truck sits at a test site is money you don''t make. Diesel Dynamix brings the CARB Clean Truck Check to you, wherever you park in Southern California.\n\n## How it works\n\n- You pick the time and place: your home, yard or a jobsite\n- We run the OBD or smoke test on the spot\n- We explain your results in plain English and tell you when your next test is due\n\nNo driving across town, no waiting in line, no surprise registration hold from the DMV because a test slipped.\n\nReply with where your truck is parked and a day that works, and we''ll lock it in.\n\nKameron\nDiesel Dynamix'),

  ('6f1b2a10-0000-4000-8000-000000000102',
   'P2 proposal · Small carriers (2–3 trucks)',
   'proposal',
   'Test all of {{company}}''s trucks in one stop',
   E'Hi {{first_name}},\n\nWith two or three trucks, Clean Truck Check deadlines are easy to lose track of, and sending each truck to a test site means more time off the road.\n\nDiesel Dynamix tests **every truck in one visit**, right at your yard anywhere in Southern California.\n\n## What {{company}} gets\n\n- All trucks tested back to back, OBD and smoke tests\n- One appointment, one invoice\n- A simple list of each truck''s next due date, so nothing slips\n- A reminder from us before the next round\n\nTell us how many trucks you have and where they park, and we''ll send you a time that fits your schedule.\n\nKameron\nDiesel Dynamix'),

  ('6f1b2a10-0000-4000-8000-000000000103',
   'P3 proposal · Growing fleets (4–10 trucks)',
   'proposal',
   'Clean Truck Check for {{company}}, scheduled around your dispatch',
   E'Hi {{first_name}},\n\nRunning 4 to 10 trucks, you can''t afford to pull units off routes one at a time for emissions testing. Diesel Dynamix tests your whole fleet on site, on a schedule built around your dispatch.\n\n## Built for fleets your size\n\n- We come to your yard or terminal and test trucks as they come in\n- Early-morning visits so trucks roll out on time\n- A compliance sheet for every unit: test result, date and next due date\n- Recurring visits on request, so every deadline is handled before it hits\n\nMost fleets your size are done in a single visit. Reply with your truck count and yard location and we''ll send a quote and available dates.\n\nKameron\nDiesel Dynamix'),

  ('6f1b2a10-0000-4000-8000-000000000104',
   'P4 proposal · Large fleets (11+ trucks)',
   'proposal',
   'An on-site Clean Truck Check program for {{company}}',
   E'Hi {{first_name}},\n\nFor a fleet the size of {{company}}, Clean Truck Check isn''t a one-time task: it''s a recurring compliance program across every unit, and testing is scheduled to become more frequent under CARB''s current rule.\n\nDiesel Dynamix runs that program for you, **on site, at your terminals**, anywhere in Southern California and at the Ports of Los Angeles and Long Beach.\n\n## What we offer large fleets\n\n- A testing calendar for your whole fleet, planned with your fleet manager\n- Our team at your yards on a recurring schedule, testing without disrupting dispatch\n- Records for every VIN: result, test date and next deadline, ready for audits\n- One point of contact and one consolidated quote for all your locations\n\nCould we set up a 15-minute call to map out your units and yards? Reply with a good time, or book directly below.\n\nKameron\nDiesel Dynamix'),

  ('6f1b2a10-0000-4000-8000-000000000201',
   'P1 follow-up · Owner-operators',
   'follow_up',
   'Re: Clean Truck Check without losing a day of work',
   E'Hi {{first_name}},\n\nJust checking in. If your Clean Truck Check is coming up, we can test your truck where it''s parked, often within the same week.\n\nReply with your location and a day that works, and it''s done.\n\nKameron\nDiesel Dynamix'),

  ('6f1b2a10-0000-4000-8000-000000000202',
   'P2 follow-up · Small carriers',
   'follow_up',
   'Re: Test all of {{company}}''s trucks in one stop',
   E'Hi {{first_name}},\n\nFollowing up on my last note. We can test all of {{company}}''s trucks in one visit at your yard, so none of them lose a day on the road.\n\nWant me to hold a time for you this month?\n\nKameron\nDiesel Dynamix'),

  ('6f1b2a10-0000-4000-8000-000000000203',
   'P3 follow-up · Growing fleets',
   'follow_up',
   'Re: Clean Truck Check for {{company}}',
   E'Hi {{first_name}},\n\nQuick follow-up. Fleets your size usually finish testing in one early-morning visit, with a compliance sheet for every truck afterwards.\n\nIf you send your truck count and yard location, I''ll put together a quote and a couple of dates.\n\nKameron\nDiesel Dynamix'),

  ('6f1b2a10-0000-4000-8000-000000000204',
   'P4 follow-up · Large fleets',
   'follow_up',
   'Re: An on-site Clean Truck Check program for {{company}}',
   E'Hi {{first_name}},\n\nCircling back on a recurring on-site testing program for {{company}}. We handle the schedule, the testing at your yards and the records for every VIN, so your team doesn''t have to chase deadlines.\n\nWho is the best person to talk to about fleet compliance? Happy to work with them directly.\n\nKameron\nDiesel Dynamix')
on conflict (id) do nothing;
