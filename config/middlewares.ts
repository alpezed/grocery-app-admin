import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
	'strapi::logger',
	'strapi::errors',
	{
		name: 'strapi::security',
		config: {
			contentSecurityPolicy: {
				useDefaults: true,
				directives: {
					'connect-src': ["'self'", 'https:'],
					'img-src': [
						"'self'",
						'data:',
						'blob:',
						'ik.imagekit.io', // Add ImageKit domain for images
						// Add your custom domain if you use one with ImageKit:
						// 'images.yourdomain.com',
					],
					'media-src': [
						"'self'",
						'data:',
						'blob:',
						'ik.imagekit.io', // Add ImageKit domain for videos/audio
						// Add your custom domain if you use one:
						// 'media.yourdomain.com',
					],
					'frame-src': [
						"'self'",
						'data:',
						'blob:',
						'eml.imagekit.io', // For ImageKit UI components
					],
					upgradeInsecureRequests: null,
				},
			},
		},
	},
	'strapi::cors',
	'strapi::poweredBy',
	'strapi::query',
	{
		name: 'strapi::body',
		config: {
			includeUnparsed: true, // This allows Stripe to verify the signature
		},
	},
	'strapi::session',
	'strapi::favicon',
	'strapi::public',
];

export default config;
