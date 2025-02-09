import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';

export default defineConfig({
  plugins: [pluginReact(), pluginSass()],
  html: {
    title: 'KorxTeam',
    favicon: './src/assets/icon.ico'
  },
  source: {
    entry: {
      index: './src/index.tsx'
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      }
    }
  },
});
