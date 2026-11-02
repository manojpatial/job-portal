import React from 'react'

export const Footer = () => {
  return (
<footer class="bg-gray-900 text-gray-300">
  <div class="mx-auto max-w-7xl px-6 py-8">
    <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">

      <p class="text-sm">
        © 2026 Your Company. All rights reserved.
      </p>

      <div class="flex gap-5">
        <a href="#" class="hover:text-white transition" aria-label="Facebook">
          Facebook
        </a>

        <a href="#" class="hover:text-white transition" aria-label="Twitter">
          Twitter
        </a>

        <a href="#" class="hover:text-white transition" aria-label="Instagram">
          Instagram
        </a>

        <a href="#" class="hover:text-white transition" aria-label="LinkedIn">
          LinkedIn
        </a>

        <a href="#" class="hover:text-white transition" aria-label="GitHub">
          GitHub
        </a>
      </div>

      <nav class="flex gap-5 text-sm">
        <a href="#" class="hover:text-white transition">Privacy</a>
        <a href="#" class="hover:text-white transition">Terms</a>
        <a href="#" class="hover:text-white transition">Contact</a>
      </nav>

    </div>
  </div>
</footer>

  )
}
