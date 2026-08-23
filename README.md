# Moon Jay Portfolio

This project is a static portfolio website with a Vercel-compatible contact form API.

## Local development

```bash
npm install
npm start
```

Visit `http://localhost:3000`.

## Vercel deployment

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Use the project root as the root directory.
4. Add these environment variables in Vercel:
   - SMTP_HOST
   - SMTP_PORT
   - SMTP_USER
   - SMTP_PASS
   - SMTP_TO
5. Deploy.

## Notes

- The frontend is static and served directly.
- The contact form runs through `/api/contact`.
- Gmail usually requires an App Password instead of a normal password.

## Required environment values

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_TO=your_receive_email@gmail.com
PORT=3000
```
