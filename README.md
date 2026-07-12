# PolarisOS

![PolarisOS logo](public/img/applications/about/splash.png)

A love letter to the early days of the desktop metaphor and the time where the internet was a series of distributed but loosely connected spaces.

> [!WARNING]
> This 'application' is very much in development. Most of the content is missing, there are going to be bugs, missing features, unexpected rewrites. I wouldn't take any coding inspiration from this until we've settled down. Thanks for hanging in there!

## Development

Developed using [Astro](https://astro.build/), [Vite](https://vite.dev/) and [Vue](https://vuejs.org/).

### Why Astro?

Because it allows reusable templates (JavaScript, layouts and components) that compile to plain HTML pages (no tricky JS router!) without (a lot of) JavaScript. Astro also runs Vue components client side so you have the best of both worlds: static pages that are easy to write but fast to load, in a fun interactive retro wrapper!

### Why Vue?

It's my preferred frontend framework. Vue 3's [composition API](https://vuejs.org/api/composition-api-setup.html) is clean to write and read and is fast. Another plus it looks similar to Astro templates. I _cannot_ recommend it _enough_.

### What's with the `src/pages/[...path].astro`?

How this project is setup is a bit unusual.

The main entry point is the OS desktop. That desktop has a "browser" application that allows users to browse my local "internet" (a collection of pages scoped to `/web/`). That browser mirrors the currently visited page to the URL bar because that way users are able to share the link to a page.

I want my users to have the following choice:
* Share a link to the "OS" with the browser application opened up to a specific URL.
* Share a link to a standalone page (without OS desktop and browser).

The `[...path].astro` file does the following:
1. It looks for all files in the `src/pages/web` directory.
1. It creates an `Astro.rewrite()` function for each valid page.
1. That page is a duplicate stub that loads the desktop environment and passes the request URL as a prop to the Vue component.

In short:
* Navigating to `/aboutme/games` provides the desktop browser with the "games"-page open.
* Navigating to `/web/aboutme/games` serves the "games"-page as a standalone page.
