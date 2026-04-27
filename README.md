# Meridian

An eating-behavior assessment for GLP-1 patients. Built with React + Vite.

---

## Deployment (the only thing left to do)

This project is configured and build-tested. To get it live, you need two free
accounts and one drag-and-drop. ~10 minutes total.

### 1. Make a GitHub account
Go to **github.com** and sign up. Free.

### 2. Make a Vercel account
Go to **vercel.com** and click **"Continue with GitHub"**. This links the two
accounts so Vercel can read your code. Also free.

### 3. Put this code on GitHub

On GitHub:
1. Click the green **New** button (top-left, or the **+** icon top-right → New repository)
2. Name it `meridian` (or whatever you like)
3. Leave it **Public** (Private also works but Public is simpler)
4. Click **Create repository**
5. On the empty repo page, click the link **"uploading an existing file"**
6. Drag every file and folder from this project's folder into the upload box
   *(yes, including the `src` folder — GitHub handles nested folders correctly)*
7. Scroll down, click **Commit changes**

### 4. Deploy on Vercel

On Vercel:
1. Click **Add New → Project**
2. Find your `meridian` repo in the list, click **Import**
3. Don't change any settings — Vercel auto-detects Vite
4. Click **Deploy**
5. Wait ~60 seconds

Vercel will give you a URL like `meridian-xyz.vercel.app`. That's your live site.

### 5. Updating later

Anytime you want to change something (your bio, the headline, etc.), edit the
file on GitHub directly using its web editor. Vercel auto-redeploys within a
minute. No tools to install.

---

## What's still left in the code (search and replace)

These are placeholders. Open `src/App.jsx` in GitHub, click the pencil icon to
edit, change the values, commit. The site updates itself.

| Placeholder         | What it is                              | Where         |
|---------------------|------------------------------------------|---------------|
| `FOUNDER_NAME`      | Your real name                           | Top of file   |
| `CONTACT_EMAIL`     | Email for waitlist/consultation requests | Top of file   |
| `FOUNDER_BIO`       | Three placeholder paragraphs about you   | About section |
| Photo placeholder   | The gradient rectangle in the About area | About section |

## Local development (optional, only if you want to test changes before pushing)

```bash
npm install
npm run dev
```

Opens at http://localhost:5173
