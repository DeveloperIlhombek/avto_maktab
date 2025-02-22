import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'http',
				hostname: '213.230.109.74',
				port: '8080',
			},
		],
	},
}

export default nextConfig
