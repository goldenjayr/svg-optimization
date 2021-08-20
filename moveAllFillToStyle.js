const { createContentItem } = require('svgo')

;('use strict')

exports.type = 'visitor'

exports.active = true

exports.name = 'custom'
exports.description = 'converts style to attributes'

exports.params = {
  keepImportant: false
}

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
      node.children.forEach((item) => {
        if (item.name === 'style') {
          styleElement = item
        }
        return
      })
    }

    if (node.name === 'style') return
    if (node.hasAttr('fill')) {
      const fill = node.attributes['fill']
      if (fill === 'none') {
        delete node.attributes['fill']
        return
      }
      if (!styleElement.children.length) {
        const elem = createContentItem({ type: 'text', value: `.st0{ fill: ${fill} }` })
        styleElement.spliceContent(0, 0, elem)
        delete node.attributes['fill']
				node.addAttr('class')
        node.attributes['class'] = `st0`
        return
      }

      let clasName = ''
      const hasFill = styleElement.children.some((item) => {
        const color = new RegExp(fill)
        const matches = item && color.test(item.value)
        if (matches) {
					className = getClassName(item.value)
        }
        return matches
      })
      if (!hasFill) {
        const lastElement = styleElement.children[styleElement.children.length - 1]
				const selector = getClassName(lastElement.value)
        const num = Number(selector.replace(/\D/g, '')) + 1

        const elem = createContentItem({ type: 'text', value: `.st${num}{ fill: ${fill} }` })
        styleElement.spliceContent(styleElement.children.length, 0, elem)
        delete node.attributes['fill']
        node.addAttr('class')
        node.attributes['class'] = `st${num}`
        return
      }

      node.addAttr('class')
			node.attributes['class'] = className
      delete node.attributes['fill']
    }

		if (node.hasAttr('style')) {
			const style = node.attributes['style']
			if (style.includes('fill')) {
				const regex = /(?<=fill:).*/
				const matches = style.match(regex)
				if (matches) {
					const fill = matches[0]
					if (fill === 'none') {
						delete node.attributes['style']
						return
					}
					if (!styleElement.children.length) {
						const elem = createContentItem({ type: 'text', value: `.st0{ fill: ${fill} }` })
						styleElement.spliceContent(0, 0, elem)
						delete node.attributes['style']
						node.addAttr('class')
						node.attributes['class'] = `st0`
						return
					}

					let clasName = ''
					const hasFill = styleElement.children.some((item) => {
						const color = new RegExp(fill)
						const matches = item && color.test(item.value)
						if (matches) {
							className = getClassName(item.value)
						}
						return matches
					})
					if (!hasFill) {
						const lastElement = styleElement.children[styleElement.children.length - 1]
						const selector = getClassName(lastElement.value)
						const num = Number(selector.replace(/\D/g, '')) + 1

						const elem = createContentItem({ type: 'text', value: `.st${num}{ fill: ${fill} }` })
						styleElement.spliceContent(styleElement.children.length, 0, elem)
						delete node.attributes['style']
						node.addAttr('class')
						node.attributes['class'] = `st${num}`
						return
					}

					node.addAttr('class')
					node.attributes['class'] = className
					delete node.attributes['style']
				}
			}

		}
  }

  return {
    element: {
      enter: enterElement
    }
  }
}

function getClassName(value) {
  const regex = /\.(.*?)\{/
  const selector = value.match(regex)
  return selector[1]
}
