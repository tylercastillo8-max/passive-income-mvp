# Waitlist integration guide

The homepage includes a static-safe waitlist form. It currently prevents submission and displays a placeholder message. This avoids losing data silently during development while keeping the app backend-free.

## Recommended providers

Use a simple form or email product with a free tier:

- Formspree for the fastest static form endpoint.
- Buttondown for a lightweight newsletter/waitlist.
- Beehiiv if you want newsletter growth features later.
- ConvertKit if you already use it for creator products.

## Formspree-style setup

1. Create a form endpoint in your provider.
2. Replace the waitlist form `action="#"` with the provider endpoint.
3. Remove or disable the JavaScript submit handler in `src/app.js` if the provider needs a normal form post.
4. Add a short privacy sentence that names the provider.
5. Submit a test email from production and confirm it is stored.

## Buttondown/Beehiiv/ConvertKit setup

1. Create a waitlist or newsletter form.
2. Copy the hosted embed or form action URL.
3. Replace the placeholder form fields with the provider's required field names.
4. Keep the form simple: email and role are enough for this experiment.
5. Do not add popups until the page has meaningful traffic.
