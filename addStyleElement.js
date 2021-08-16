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
  const enterElement = (node) => {
    if (node.name === 'svg' && node.children) {
      let hasStyleElement = false
      node.children.forEach((item) => {
        if (item.matches('style')) {
          hasStyleElement = true
        }
        return
      })
      if (!hasStyleElement) {
        const elem = createContentItem({
          type: 'element',
          name: 'style',
          attributes: {},
          children: []
        })
        node.spliceContent(0, 0, elem)
      }
    }
  }

  return {
    element: {
      enter: enterElement
    }
  }
}
