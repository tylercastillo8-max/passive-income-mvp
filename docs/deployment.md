# Deployment guide

WelcomeKit is a static site. There is no backend, database, authentication, paid API, or build pipeline required.

## Recommended free deployment: Netlify drag-and-drop

1. Run the tests locally with `npm test`.
2. Go to Netlify and create a free account if you do not already have one.
3. Drag the repository folder into Netlify's manual deploy area, or connect the Git repository.
4. Use these settings if prompted:
   - Build command: leave blank
   - Publish directory: `.`
5. Open the generated URL and test the form, copy buttons, and Markdown download.

## Cloudflare Pages

1. Create a new Pages project from the Git repository.
2. Use these settings:
   - Framework preset: None
   - Build command: leave blank
   - Output directory: `/`
3. Deploy and test the generated URL.

## GitHub Pages

1. Push the repository to GitHub.
2. In repository settings, enable Pages.
3. Select the current branch and root folder.
4. Save and wait for the Pages URL to become available.

## Local preview

```bash
python3 -m http.server 4173
```

Visit `http://localhost:4173`.

## Production checklist

- Confirm `index.html` loads over HTTPS.
- Generate one test kit and download it.
- Copy the kickoff email and paste it into a draft email.
- Confirm the footer disclaimer is visible.
- Confirm the `/templates/` page works on the deployed URL.
- Connect the waitlist form to an email provider if you want signups stored.
- Add analytics only if you can do it with a privacy-friendly free tier.
