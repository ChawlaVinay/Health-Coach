# Whoop setup (Stage 3)

1. GitHub: create a free account, then a New repository (Private). Unzip this package, open the repository page, choose Add file > Upload files, and drag in everything from the unzipped folder, including the `netlify` folder. Commit.
2. Netlify: Add new project > Import an existing project > GitHub > pick the repository. Leave build settings empty and deploy.
3. Netlify: Project configuration > Environment variables. Add WHOOP_CLIENT_ID, WHOOP_CLIENT_SECRET, SUPABASE_URL (your project URL), SUPABASE_SERVICE_KEY (your secret / service_role key). Then Deploys > Trigger deploy.
4. Supabase: Authentication > URL Configuration. Set Site URL and Redirect URLs to your new Netlify address.
5. WHOOP developer dashboard: open your app, set the Redirect URL to https://YOUR-NEW-ADDRESS.netlify.app/.netlify/functions/whoop-callback (exactly), and make sure the scopes offline, read:recovery, read:sleep, read:cycles, read:workout, read:profile, read:body_measurement are enabled.
6. Open the app, sign in, and tap Connect Whoop on the Today tab.
