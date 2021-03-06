import $ from 'cafy';
import { ID } from '../../../../misc/cafy-id';
import define from '../../define';
import { NoteFavorites } from '../../../../models';
import { makePaginationQuery } from '../../common/make-pagination-query';
import { types, bool } from '../../../../misc/schema';

export const meta = {
	desc: {
		'ja-JP': 'お気に入りに登録した投稿一覧を取得します。',
		'en-US': 'Get favorited notes'
	},

	tags: ['account', 'notes', 'favorites'],

	requireCredential: true,

	kind: 'read:favorites',

	params: {
		limit: {
			validator: $.optional.num.range(1, 100),
			default: 10
		},

		sinceId: {
			validator: $.optional.type(ID),
		},

		untilId: {
			validator: $.optional.type(ID),
		},
	},

	res: {
		type: types.array,
		optional: bool.false, nullable: bool.false,
		items: {
			type: types.object,
			optional: bool.false, nullable: bool.false,
			ref: 'NoteFavorite',
		}
	},
};

export default define(meta, async (ps, user) => {
	const query = makePaginationQuery(NoteFavorites.createQueryBuilder('favorite'), ps.sinceId, ps.untilId)
		.andWhere(`favorite.userId = :meId`, { meId: user.id })
		.leftJoinAndSelect('favorite.note', 'note');

	const favorites = await query
		.take(ps.limit!)
		.getMany();

	return await NoteFavorites.packMany(favorites, user);
});
