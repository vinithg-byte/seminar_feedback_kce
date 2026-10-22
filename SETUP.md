# PowerFlow AI Workshop Feedback Website

A responsive HTML/CSS/JavaScript feedback page for the three sessions shown on your event poster. Includes animated hero, speaker portraits, mobile-friendly college banner, participant details (name, college, department, year, role, optional email), individual 1–5 star ratings, optional per-session comments, overall rating and feedback, recommendation question, and Supabase database integration.

## Files
- `index.html` — page structure
- `style.css` — responsive premium dark AI design and animations
- `script.js` — star ratings, validation, and database insert
- `config.js` — Supabase project URL and publishable key placeholders
- `supabase_setup.sql` — table and Row Level Security setup
- `assets/` — three portrait images supplied in the conversation
- College banner — custom animated visual treatment with KCE initials. It is a designed illustration, not an official campus photograph; replace it with an approved college photo/logo if desired.

## Connect the database
1. Create a project at https://supabase.com/. vinith25base
2. In the Supabase project, open **SQL Editor**, create a query, paste all of `supabase_setup.sql`, and run it.
3. If you already created the old table before this update, add the new columns first in SQL Editor:
```sql
alter table public.workshop_feedback
  add column if not exists college_name text,
  add column if not exists department text,
  add column if not exists year_of_study text,
  add column if not exists participant_role text,
  add column if not exists email text;
```
For a new project, just run the updated `supabase_setup.sql`.
4. Open **Project Settings / API** (or the project's Connect/API section) and copy the Project URL and **publishable key**. Depending on the dashboard version, the legacy `anon` key may also be shown.
5. Edit `config.js` and replace `https://YOUR_PROJECT_ID.supabase.co` and `YOUR_SUPABASE_PUBLISHABLE_KEY` with your actual values.
6. Do **not** use the `service_role` key or any secret key in browser code.
7. Open `index.html` through a local web server (VS Code Live Server is convenient), or deploy the folder to GitHub Pages / Netlify / Vercel.
8. Submit a test response, then check **Supabase → Table Editor → workshop_feedback**.

## Export responses to Excel
In Supabase, open **Table Editor → workshop_feedback** and use its CSV export/download option. Open the downloaded `.csv` in Microsoft Excel. CSV is Excel-compatible. Keep the table private: this starter deliberately allows public inserts only, not public reads.

## Deploy
- **Netlify:** sign in, choose Add new site / deploy manually, and upload the extracted folder.
- **Vercel:** import the folder's GitHub repository as a static site. No build command is needed; the root directory is this folder.
- **GitHub Pages:** push the files to a repository and enable Pages for the branch/root folder.

## Important security notes
- The frontend publishable/anon key is designed to be public; the SQL Row Level Security policy limits anonymous users to inserting rows. Never expose a service-role/secret key.
- This starter does not include an admin dashboard/login. View and export responses from the protected Supabase dashboard. If adding an admin dashboard later, implement authentication and server-side/role-based read access first.
- Public anonymous forms can receive spam. For a real public event, consider rate limiting, CAPTCHA, and a duplicate-submission strategy.
- The portrait files were supplied by you. Please confirm you have permission to use them on the website.
- Verify speaker details and session titles against the official event poster before publishing.
