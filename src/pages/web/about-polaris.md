---
title: About PolarisOS
layout: /src/layouts/web/AboutPolaris.astro
---

# About PolarisOS

---

<!-- Might be solved with Sätteri 0.10? -->
<!-- https://github.com/bruits/satteri/issues/139 -->
<p class="opening">
A love letter to the early days of the desktop metaphor and the time where the internet was a series of distributed but loosely connected spaces.
</p>

## Development

This website was written in [Astro](https://astro.build) and [Vue.js](https://vuejs.org/) built with [Vite](https://vite.dev).

### Why Astro?

Because it allows reusable templates (JavaScript, layouts and components) that compile to plain HTML pages (no tricky JS router!) without (a lot of) JavaScript. Astro also runs Vue components client side so you have the best of both worlds: static pages that are easy to write but fast to load, in a fun interactive retro wrapper!

### Why Vue?

It's my preferred frontend framework. Vue 3's [composition API](https://vuejs.org/api/composition-api-setup.html) is clean to write and read and is fast. Another plus it looks similar to Astro templates. I _cannot_ recommend it _enough_.

While I understand it might be a little bit against the spirit of writing every piece of HTML yourself, it gives me so much flexibility that I cannot refuse that! :-)

Also, given I'm an old lad; I was there, doing that back in the day. [I've walked the talk.](https://en.wiktionary.org/wiki/walk_the_talk)

## Your data

This site has **no server backend** and is a totally static. Your "settings" are saved on your device in the browsers [Local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). There are **no trackers**, there are no third party requests other than loading the fonts from Googles CDN. (Only if you select other fonts than the default sans-serif and serif.)

## Credits

The draggability of the windows is powered by [VueUse](https://vueuse.org/), the Vue Swiss army knife full of great utilities.

The fonts used in this website are freely available from [Google Fonts](https://fonts.google.com). Every font is included with attribution, viewable in the `Font picker`

Most of the available wallpapers were originally shipped with MacOS 7.5.3 and are copyrighted materials. Every wallpaper is included with attribution, viewable in the `Wallpaper picker`. They fit the theme I was going for so well I decided to include them in the most original way possible.

If my site happens to use materials you are the original author of, please let me know.
