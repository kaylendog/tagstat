import { parse } from "csv-parse";
import * as fs from "fs";
import { resolve } from "path";

import { PrismaClient, TagCategory } from "@prisma/client";

const client = new PrismaClient();

export const streamCsv = (
	path: string,
	handler: (records: any[]) => Promise<void> | void
) => {
	const stream = fs.createReadStream(path);
	const parser = parse({ delimiter: "," });

	stream.pipe(parser);

	let totalRecordsProcessed = 0;

	parser.on("readable", async () => {
		const records: any[] = [];
		let record: any;
		while ((record = parser.read()) !== null) {
			records.push(record);
		}
		await handler(records);
		totalRecordsProcessed++;
	});

	const progress = setInterval(() => {
		console.log("Total records processed: " + totalRecordsProcessed);
	}, 1e3);

	parser.on("end", () => clearInterval(progress));
};

streamCsv(
	resolve(__dirname, "../data/tags-2022-12-06.csv"),
	async (records) => {
		const toCategory = (int: number) => {
			switch (int) {
				case 0:
					return TagCategory.General;
				case 1:
					return TagCategory.Artist;
				case 3:
					return TagCategory.Copyright;
				case 4:
					return TagCategory.Character;
				case 5:
					return TagCategory.Species;
				case 6:
					return TagCategory.Invalid;
				case 7:
					return TagCategory.Meta;
				case 8:
					return TagCategory.Lore;
				default:
					return TagCategory.Invalid;
			}
		};

		await client.tag.createMany({
			data: records
				.filter(
					([id, , , post_count]) =>
						!isNaN(parseInt(id)) && !isNaN(parseInt(post_count))
				)
				.map(([id, name, category, post_count]) => ({
					id: parseInt(id),
					name,
					category: toCategory(parseInt(category)),
					count: parseInt(post_count),
				})),
		});
	}
);
