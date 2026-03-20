import { factories } from '@strapi/strapi';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default factories.createCoreController(
	'api::transaction.transaction',
	({ strapi }) => ({
		async find(ctx) {
			// 1. Extract filters from the request query (e.g., ?filters[clerkId]=user_123)
			const { filters } = ctx.query as { filters: { clerkId: string } };

			// 2. Build a Stripe Search Query if filters exist
			// Example: Stripe expects "metadata['clerkId']:'val'"
			let searchQuery = '';
			if (filters?.clerkId) {
				searchQuery = `metadata['clerkId']:'${filters.clerkId}'`;
			}

			try {
				let transactions:
					| Stripe.Response<Stripe.ApiList<Stripe.PaymentIntent>>
					| Stripe.Response<Stripe.ApiSearchResult<Stripe.PaymentIntent>>;

				if (searchQuery) {
					// Use search API if we have filters
					transactions = await stripe.paymentIntents.search({
						query: searchQuery,
						expand: ['data.payment_method', 'data.customer'],
					});
				} else {
					// Default to list if no filters
					transactions = await stripe.paymentIntents.list({
						limit: 20,
						expand: ['data.payment_method', 'data.customer'],
					});
				}

				const formattedData = transactions.data.map(intent => {
					const paymentMethod = intent.payment_method as Stripe.PaymentMethod;
					return {
						id: intent.id,
						amount: intent.amount / 100,
						currency: intent.currency.toUpperCase(),
						date: intent.created,
						brand: paymentMethod?.card?.brand || 'unknown',
						last4: paymentMethod?.card?.last4 || '****',
						status: intent.status,
					};
				});

				return { data: formattedData };
			} catch (err) {
				ctx.throw(500, err instanceof Error ? err.message : 'Stripe Error');
			}
		},
	})
);
