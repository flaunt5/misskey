import $ from 'cafy';
import define from '../../../define';
import { Emojis } from '../../../../../models';
import { toPunyNullable } from '../../../../../misc/convert-host';

export const meta = {
	desc: {
		'ja-JP': 'カスタム絵文字を取得します。'
	},

	tags: ['admin'],

	requireCredential: true,
	requireModerator: true,

	params: {
		host: {
			validator: $.optional.nullable.str,
			default: null as any
		}
	}
};

export default define(meta, async (ps) => {
	const emojis = await Emojis.find({
		host: toPunyNullable(ps.host)
	});

	return emojis.map(e => ({
		id: e.id,
		name: e.name,
		aliases: e.aliases,
		host: e.host,
		url: e.url
	}));
});
