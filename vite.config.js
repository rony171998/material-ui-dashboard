import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import million from 'million/compiler'

// https://vitejs.dev/config/
// https://million.dev/docs/install
export default defineConfig({
	build: {
		chunkSizeWarningLimit: 100,
		rollupOptions: {
			onwarn(warning, warn) {
				if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
					return
				}
				warn(warning)
			}
		}
	},
	//plugins: [million.vite({ auto: true }), react()],
    plugins: [react()],
	assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg'],
	server: {
		port: '4000',
		host: '0.0.0.0',
		// fs: {
		// 	allow: ['/home/rony171998/SGV-WMS-FRONTEND']
		// }
	},
	test: {
		globals: true,
		environment: 'jsdom'
	}
})
