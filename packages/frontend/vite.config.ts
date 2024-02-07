import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import { presetUno, presetAttributify, presetWebFonts, transformerDirectives } from 'unocss';
import extractorPug from '@unocss/extractor-pug';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS({
      presets: [
        presetUno(),
        presetAttributify(),
        presetWebFonts({ fonts: { sans: 'Roboto' } }),
      ],
      extractors: [extractorPug()],
      transformers: [transformerDirectives()],
    }),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
