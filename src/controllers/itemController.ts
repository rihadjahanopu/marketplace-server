import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { Item } from "../models/Item.js";

export const getItems = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const {
			search,
			category,
			minPrice,
			maxPrice,
			location,
			sortBy = "createdAt",
			order = "desc",
			page = "1",
			limit = "12",
		} = req.query;

		const query: any = {};

		if (search) {
			query.$text = { $search: search as string };
		}

		if (category && category !== "all") {
			query.category = category;
		}

		if (minPrice || maxPrice) {
			query.price = {};
			if (minPrice) query.price.$gte = Number(minPrice);
			if (maxPrice) query.price.$lte = Number(maxPrice);
		}

		if (location) {
			query.location = { $regex: location as string, $options: "i" };
		}

		const sortOptions: any = {};
		sortOptions[sortBy as string] = order === "asc" ? 1 : -1;

		const pageNum = Math.max(1, Number(page));
		const limitNum = Math.min(50, Math.max(1, Number(limit)));
		const skip = (pageNum - 1) * limitNum;

		const [items, total] = await Promise.all([
			Item.find(query)
				.sort(sortOptions)
				.skip(skip)
				.limit(limitNum)
				.populate("createdBy", "name email"),
			Item.countDocuments(query),
		]);

		res.status(200).json({
			success: true,
			items,
			pagination: {
				page: pageNum,
				limit: limitNum,
				total,
				pages: Math.ceil(total / limitNum),
			},
		});
	}
);

export const getItemById = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const item = await Item.findById(req.params.id).populate(
			"createdBy",
			"name email createdAt"
		);

		if (!item) {
			res.status(404).json({ success: false, message: "Item not found" });
			return;
		}

		res.status(200).json({ success: true, item });
	}
);

export const createItem = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const itemData = {
			...req.body,
			createdBy: req.user!.id,
		};

		const item = await Item.create(itemData);
		await item.populate("createdBy", "name email");

		res.status(201).json({
			success: true,
			message: "Item created successfully",
			item,
		});
	}
);

export const deleteItem = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const item = await Item.findOne({
			_id: req.params.id,
			createdBy: req.user!.id,
		});

		if (!item) {
			res
				.status(404)
				.json({ success: false, message: "Item not found or unauthorized" });
			return;
		}

		await Item.deleteOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			message: "Item deleted successfully",
		});
	}
);

export const getMyItems = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const items = await Item.find({ createdBy: req.user!.id })
			.sort({ createdAt: -1 })
			.populate("createdBy", "name email");

		res.status(200).json({ success: true, items });
	}
);

export const getCategories = asyncHandler(
	async (_req: Request, res: Response): Promise<void> => {
		const categories = [
			"Electronics",
			"Vehicles",
			"Real Estate",
			"Fashion",
			"Home & Garden",
			"Sports",
			"Books",
			"Services",
			"Other",
		];
		res.status(200).json({ success: true, categories });
	}
);

export const getStats = asyncHandler(
	async (_req: Request, res: Response): Promise<void> => {
		const totalItems = await Item.countDocuments();
		const totalCategories = 9;
		const avgPrice = await Item.aggregate([
			{ $group: { _id: null, avg: { $avg: "$price" } } },
		]);
		const recentItems = await Item.find()
			.sort({ createdAt: -1 })
			.limit(5)
			.populate("createdBy", "name");

		const categoryStats = await Item.aggregate([
			{ $group: { _id: "$category", count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
		]);

		const monthlyStats = await Item.aggregate([
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
			{ $limit: 12 },
		]);

		res.status(200).json({
			success: true,
			stats: {
				totalItems,
				totalCategories,
				averagePrice: avgPrice[0]?.avg || 0,
				recentItems,
				categoryStats,
				monthlyStats,
			},
		});
	}
);
