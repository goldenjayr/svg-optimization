const util = require('util')
'use strict';

exports.type = 'visitor';

exports.active = true;

exports.name = 'custom'
exports.description = 'converts style to attributes';

exports.params = {
  keepImportant: false,
};

// var stylingProps = require('./_collections').attrsGroups.presentation,
//   rEscape = '\\\\(?:[0-9a-f]{1,6}\\s?|\\r\\n|.)', // Like \" or \2051. Code points consume one space.
//   rAttr = '\\s*(' + g('[^:;\\\\]', rEscape) + '*?)\\s*', // attribute name like ‘fill’
//   rSingleQuotes = "'(?:[^'\\n\\r\\\\]|" + rEscape + ")*?(?:'|$)", // string in single quotes: 'smth'
//   rQuotes = '"(?:[^"\\n\\r\\\\]|' + rEscape + ')*?(?:"|$)', // string in double quotes: "smth"
//   rQuotedString = new RegExp('^' + g(rSingleQuotes, rQuotes) + '$'),
//   // Parentheses, E.g.: url(data:image/png;base64,iVBO...).
//   // ':' and ';' inside of it should be threated as is. (Just like in strings.)
//   rParenthesis =
//     '\\(' + g('[^\'"()\\\\]+', rEscape, rSingleQuotes, rQuotes) + '*?' + '\\)',
//   // The value. It can have strings and parentheses (see above). Fallbacks to anything in case of unexpected input.
//   rValue =
//     '\\s*(' +
//     g(
//       '[^!\'"();\\\\]+?',
//       rEscape,
//       rSingleQuotes,
//       rQuotes,
//       rParenthesis,
//       '[^;]*?'
//     ) +
//     '*?' +
//     ')',
//   // End of declaration. Spaces outside of capturing groups help to do natural trimming.
//   rDeclEnd = '\\s*(?:;\\s*|$)',
//   // Important rule
//   rImportant = '(\\s*!important(?![-(\\w]))?',
//   // Final RegExp to parse CSS declarations.
//   regDeclarationBlock = new RegExp(
//     rAttr + ':' + rValue + rImportant + rDeclEnd,
//     'ig'
//   ),
//   // Comments expression. Honors escape sequences and strings.
//   regStripComments = new RegExp(
//     g(rEscape, rSingleQuotes, rQuotes, '/\\*[^]*?\\*/'),
//     'ig'
//   );

/**
 * Convert style in attributes. Cleanups comments and illegal declarations (without colon) as a side effect.
 *
 * @example
 * <g style="fill:#000; color: #fff;">
 *             ⬇
 * <g fill="#000" color="#fff">
 *
 * @example
 * <g style="fill:#000; color: #fff; -webkit-blah: blah">
 *             ⬇
 * <g fill="#000" color="#fff" style="-webkit-blah: blah">
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function (item) {

	let styleElement = null

	const enterElement = (node) => {
		if (node.name === 'svg' && node.children) {
      console.log("🚀 ~ file: customPlugin.js ~ line 77 ~ enterElement ~ node", node)
			let style
			style = node.children.find(item => item.name === 'style')
      console.log("🚀 ~ file: customPlugin.js ~ line 79 ~ enterElement ~ style", style)
			if (!style)	{
				node.children.splice(0, 0, {
					type: 'element',
					name: 'style',
					attributes: {},
					children: []
				})
			}
			// console.log("🚀 ~ file: customPlugin.js ~ line 74 ~ node", style)
			// styleElement = style
			// return
		}
		// if (node.type === 'element' && 'fill' in node.attributes) {
		// 	console.log("🚀 ~ file: customPlugin.js ~ line 74 ~ styleElement", styleElement)
		// 	// delete item.attributes.fill
		// 	console.log(util.inspect(node, false, null, true))
		// }
	}

	return {
		element: {
			enter: enterElement
		}
	}
};
