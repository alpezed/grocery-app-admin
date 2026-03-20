export default {
	async beforeCreate(event) {
		const { result } = event;
		console.log('--beforeCreate', { event });
	},

	async beforeUpdate(event) {
		const { data, where } = event.params;

		// 1. Check if the user is trying to set this address as default
		if (data.isDefault === true) {
			// 2. Identify the user.
			// If creating, it's in data. If updating, you might need to fetch the existing record if not provided.
			const userId =
				data.clerkId ||
				(where.id
					? (
							await strapi.entityService.findOne(
								'api::address.address',
								where.id
							)
						).clerkId
					: null);

			if (!userId) return;

			// 3. Set all other addresses for this user to isDefault: false
			// We use the low-level db query for high performance
			await strapi.db.query('api::address.address').updateMany({
				where: {
					clerkId: userId,
					isDefault: true,
					id: { $ne: where?.id }, // Don't flip the one we are currently saving
				},
				data: {
					isDefault: false,
				},
			});
		}
	},
};
